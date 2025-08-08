import { PaginatedResult } from "../types/shared.types";
import {
  AdminOrder,
  GetAllOrdersOptions,
  LinkedOrder,
  OrderBase,
  OrderDelivery,
  OrderFavorite,
  OrderMedia,
  OrderStage,
  Stage,
  StageStatus,
} from "../types/order.types";
import { PersonRole } from "../types/person.types";
import { PaymentStatus } from "../types/finance.type";

import db from "../db/db";

import { paginateQuery } from "../utils/pagination";
import {
  definePaymentStatus,
  getVisibleFieldsForRoleAndContext,
} from "../utils/helpers";

export const OrderModel = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
    user_id,
    user_role,
  }: GetAllOrdersOptions): Promise<PaginatedResult<OrderBase>> {
    const visibleFields = getVisibleFieldsForRoleAndContext(user_role);

    const baseQuery = db("orders").modify((qb) => {
      qb.leftJoin("order_favorites", function () {
        this.on("order_favorites.order_id", "=", "orders.id").andOn(
          "order_favorites.person_id",
          "=",
          db.raw("?", [user_id])
        );
      });

      qb.select(
        db.raw(
          `CASE WHEN order_favorites.person_id IS NOT NULL THEN true ELSE false END as is_favorite`
        )
      );

      qb.select(
        db.raw(`(
         SELECT COALESCE(json_agg(m), '[]'::json)
          FROM (
            SELECT id, url, public_id, is_main, created_at
              FROM order_media
              WHERE order_media.order_id = orders.id
              AND type = 'image'
            ORDER BY 
            -- Prefer is_main=true first, then by created_at
            CASE WHEN is_main THEN 0 ELSE 1 END,
            created_at ASC
        LIMIT 1
        ) m
      ) as media`)
      );

      if (user_role === "super_admin") {
        qb.leftJoin(
          db.raw(`LATERAL (
            SELECT status
            FROM order_stage_statuses
            WHERE order_stage_statuses.order_id = orders.id
              AND order_stage_statuses.stage = orders.active_stage::order_stage
            ORDER BY created_at DESC
            LIMIT 1
          ) as stage_statuses`),
          db.raw("true")
        );
        qb.select("stage_statuses.status as active_stage_status");
      }

      const joins = ["customer", "modeller", "miller", "printer"];
      joins.forEach((role) => {
        if (visibleFields.includes(`${role}_id`)) {
          qb.leftJoin(
            `persons as ${role}s`,
            `${role}s.id`,
            `orders.${role}_id`
          ).select(
            `${role}s.id as ${role}_id`,
            `${role}s.last_name as ${role}_last_name`,
            `${role}s.first_name as ${role}_first_name`,
            `${role}s.patronymic as ${role}_patronymic`
          );
        }
      });

      visibleFields.forEach((field) => {
        qb.select(`orders.${field}`);
      });

      if (user_role === "modeller") qb.where("modeller_id", user_id);
      if (user_role === "miller") qb.where("miller_id", user_id);
    });

    if (filters?.active_stage) {
      baseQuery.where("active_stage", filters.active_stage);
    }

    if (filters?.payment_status && filters.payment_status.length > 0) {
      baseQuery.whereIn("payment_status", filters.payment_status);
    }
    if (filters?.is_important?.length) {
      baseQuery.whereIn("is_important", filters.is_important);
    }

    if (filters?.is_favorite?.length) {
      baseQuery.where(function () {
        if (filters?.is_favorite?.includes(true)) {
          this.orWhereExists(function () {
            this.select("*")
              .from("order_favorites")
              .whereRaw("order_favorites.order_id = orders.id")
              .andWhere("order_favorites.person_id", user_id);
          });
        }

        if (filters.is_favorite?.includes(false)) {
          this.orWhereNotExists(function () {
            this.select("*")
              .from("order_favorites")
              .whereRaw("order_favorites.order_id = orders.id")
              .andWhere("order_favorites.person_id", user_id);
          });
        }
      });
    }

    if (filters?.active_stage_status?.length) {
      baseQuery.whereRaw(
        `(
           SELECT status
           FROM order_stage_statuses
           WHERE order_stage_statuses.order_id = orders.id
             AND order_stage_statuses.stage = orders.active_stage::order_stage
           ORDER BY created_at DESC
           LIMIT 1
        ) = ANY(?)`,
        [filters.active_stage_status]
      );
    }

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("orders.name", `%${search}%`).orWhereILike(
          "orders.number",
          `%${search}%`
        );

        const personRoles = ["customer", "modeller", "miller", "printer"];
        personRoles.forEach((role) => {
          if (visibleFields.includes(`${role}_id`)) {
            qb.orWhereILike(`${role}s.first_name`, `%${search}%`)
              .orWhereILike(`${role}s.last_name`, `%${search}%`)
              .orWhereILike(`${role}s.patronymic`, `%${search}%`);
          }
        });
      });
    }

    return paginateQuery(baseQuery, { page, limit, sortBy, order });
  },

  async getFavoriteOrderByIdAndUserId(personId: number, orderId: number) {
    return await db<OrderFavorite>("order_favorites")
      .where("person_id", personId)
      .andWhere("order_id", orderId)
      .first();
  },

  async getOrderBaseById(orderId: number): Promise<OrderBase> {
    const [order] = await db<OrderBase>("orders").where("id", orderId);
    return order;
  },

  async getOrdersBaseByIds(orderIds: number[]): Promise<OrderBase[]> {
    const orders = await db<OrderBase>("orders").whereIn("id", orderIds);
    return orders;
  },

  async getOrderStagesByOrderId(orderId: number) {
    return await db<OrderStage>("order_stage_statuses").where(
      "order_id",
      orderId
    );
  },
  async getOrderStagesByOrderIds(orderIds: number[]) {
    return await db<OrderStage>("order_stage_statuses").whereIn(
      "order_id",
      orderIds
    );
  },

  async getOrderStagesForOrders(orderIds: number[], role: string) {
    const query = db("order_stage_statuses").whereIn("order_id", orderIds);

    if (role === "modeller") query.andWhere("stage", "modeling");
    else if (role === "miller") query.andWhere("stage", "milling");

    const rows = await query.orderBy("created_at", "desc");

    // Group by order_id
    return rows.reduce((acc, row) => {
      if (!acc[row.order_id]) acc[row.order_id] = [];
      acc[row.order_id].push(row);
      return acc;
    }, {} as Record<number, any[]>);
  },

  async getOrderMedia({ orderId }: { orderId: number }): Promise<OrderMedia[]> {
    const media = await db<OrderMedia>("order_media").where(
      "order_id",
      orderId
    );

    return media;
  },

  async getOrderImage({ orderId }: { orderId: number }): Promise<OrderMedia[]> {
    const media = await db<OrderMedia>("order_media")
      .where("order_id", orderId)
      .limit(1);

    return media;
  },

  async toggleFavorite({
    orderId,
    personId,
  }: {
    orderId: number;
    personId: number;
  }): Promise<{ status: string; orderId: number }> {
    const existing = await db<OrderFavorite>("order_favorites")
      .where("order_id", orderId)
      .andWhere("person_id", personId)
      .first();

    if (existing) {
      await db<OrderFavorite>("order_favorites")
        .where("person_id", personId)
        .andWhere("order_id", orderId)
        .del();
      return { status: "favorite_removed", orderId };
    } else {
      await db<OrderFavorite>("order_favorites").insert({
        person_id: personId,
        order_id: orderId,
      });
      return { status: "favorite_added", orderId };
    }
  },

  async toggleImportant({
    orderId,
    isImportant,
  }: {
    orderId: number;
    isImportant: boolean;
  }): Promise<AdminOrder> {
    const [updatedOrder] = await db<AdminOrder>("orders")
      .where("id", orderId)
      .update({ is_important: isImportant, updated_at: new Date() })
      .returning<AdminOrder[]>("*");

    return updatedOrder;
  },
  async countByStage(exclusion: string): Promise<Record<string, number>> {
    const rows = await db("orders")
      .select("active_stage")
      .whereNot("active_stage", exclusion)
      .count("* as count")
      .groupBy("active_stage");

    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.active_stage] = Number(row.count);
    }
    return result;
  },
  async updateOrderPaymentStatus(orderId: number) {
    const order = await db("orders").where("id", orderId).first();
    const invoices = await db("invoices").where("order_id", orderId);

    const totalPaid = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount_paid || 0),
      0
    );
    const orderAmount = Number(order.amount || 0);

    let status: PaymentStatus = definePaymentStatus(totalPaid, orderAmount);

    await db("orders").update({ payment_status: status }).where("id", orderId);
  },

  async createBaseOrder(fields: Partial<OrderBase>) {
    const [newOrder] = await db<OrderBase>("orders")
      .insert(fields)
      .returning<OrderBase[]>("*");

    return newOrder;
  },
  async updateBaseOrder(orderId: number, fields: Partial<OrderBase>) {
    return await db<OrderBase>("orders")
      .where("id", orderId)
      .update(fields)
      .returning("*");
  },

  async getLinkedOrders(orderId: number): Promise<LinkedOrder[]> {
    return await db<LinkedOrder>("order_links")
      .where("order_id", orderId)
      .leftJoin("orders", "orders.id", "order_links.linked_order_id")
      .select("order_links.*", "orders.number as linked_order_number");
  },

  async createLinkedOrders(orderId: number, links: LinkedOrder[]) {
    await db<LinkedOrder>("order_links").insert(
      links.map((lo) => ({
        ...lo,
        order_id: orderId,
      }))
    );
  },

  async replaceLinkedOrders(orderId: number, links: LinkedOrder[]) {
    await db<LinkedOrder>("order_links").where("order_id", orderId).del();
    await db<LinkedOrder>("order_links").insert(
      links.map((lo) => ({
        ...lo,
        order_id: orderId,
      }))
    );
  },
  async getMediaByOrderId(orderId: number): Promise<OrderMedia[]> {
    return await db<OrderMedia>("order_media").where("order_id", orderId);
  },

  async updateMediaFlags(toUpdate: OrderMedia[], updatedMedia: OrderMedia[]) {
    await Promise.all(
      toUpdate.map((m) => {
        const updated = updatedMedia.find((u) => u.id === m.id);
        return db("order_media")
          .where("id", m.id)
          .update({ is_main: updated?.is_main });
      })
    );
  },

  async insertMedia(orderId: number, media: Partial<OrderMedia>[]) {
    await db("order_media").insert(
      media.map((m) => ({ ...m, order_id: orderId }))
    );
  },

  async deleteMediaByIds(ids: number[]) {
    await db<OrderMedia>("order_media").whereIn("id", ids).del();
  },
  async getDelivery(orderId: number): Promise<OrderDelivery> {
    const delivery = await db<OrderDelivery>("order_deliveries")
      .where("order_id", orderId)
      .leftJoin(
        "delivery_addresses",
        "delivery_addresses.id",
        "order_deliveries.delivery_address_id"
      )
      .leftJoin("cities", "delivery_addresses.city_id", "cities.id")
      .select(
        "order_deliveries.id as id",
        "order_deliveries.order_id",
        "order_deliveries.delivery_address_id",
        "order_deliveries.delivery_service",
        "order_deliveries.cost",
        "order_deliveries.status",
        "order_deliveries.declaration_number",
        "order_deliveries.estimated_delivery_date",
        "order_deliveries.actual_delivery_date",
        "order_deliveries.is_third_party",
        "order_deliveries.manual_recipient_name",
        "order_deliveries.manual_recipient_phone",
        "order_deliveries.manual_delivery_address",
        "delivery_addresses.id as delivery_address_id",
        "delivery_addresses.type",
        "delivery_addresses.np_warehouse_ref",
        "delivery_addresses.np_warehouse",
        "delivery_addresses.np_warehouse_siteKey",
        "delivery_addresses.street",
        "delivery_addresses.street_ref",
        "delivery_addresses.house_number",
        "delivery_addresses.flat_number",
        "delivery_addresses.np_recipient_ref",
        "delivery_addresses.np_contact_recipient_ref",
        "cities.name as city_name",
        "cities.ref as city_ref",
        "cities.region",
        "cities.area"
      )
      .first();
    return delivery;
  },
  async insertDelivery(delivery: Partial<OrderDelivery>) {
    await db("order_deliveries").insert(delivery);
  },
  async updateDelivery(orderId: number, delivery: Partial<OrderDelivery>) {
    await db("order_deliveries").where("order_id", orderId).update(delivery);
  },

  async insertStage(stage: Partial<OrderStage>) {
    await db("order_stage_statuses").insert(stage);
  },
  async updateStage(
    orderId: number,
    stage: Stage,
    fields: Partial<OrderStage>
  ) {
    await db<OrderStage>("order_stage_statuses")
      .where("order_id", orderId)
      .andWhere("stage", stage)
      .update(fields);
  },

  async getOrdersNumbers({
    search,
  }: {
    search: string;
  }): Promise<PaginatedResult<{ id: number; number: number }>> {
    // const visibleFields = getVisibleFieldsForRoleAndContext(user_role);

    const baseQuery = db<OrderBase>("orders").select("id", "number");

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("orders.number", `%${search}%`);
      });
    }

    return paginateQuery(baseQuery, {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      order: "desc",
    });
  },

  async deleteOrder(orderId: number): Promise<number> {
    return await db<OrderBase>("orders").where("id", orderId).del();
  },
  async syncAllOrderPaymentStatuses() {
    const orders = await db("orders").select("id");
    for (const order of orders) {
      await OrderModel.updateOrderPaymentStatus(order.id);
    }
  },

  async getOrdersByCustomerIds({
    customerIds,
    from,
    to,
  }: {
    customerIds: number[];
    from: Date;
    to: Date;
  }): Promise<OrderBase[]> {
    return await db<OrderBase>("orders")
      .whereIn("customer_id", customerIds)
      .andWhereBetween("created_at", [from, to]);
  },
  // async getOrdersByCustomerId({
  //   customerId,
  //   from,
  //   to,
  // }: {
  //   customerId: number;
  //   from: Date;
  //   to: Date;
  // }): Promise<OrderBase[]> {
  //   return await db<OrderBase>("orders")
  //     .where("customer_id", customerId)
  //     .andWhereBetween("created_at", [from, to]);
  // },

  // async getLastCustomerOrder(customerId: number): Promise<OrderBase | null> {
  //   const order = await db<OrderBase>("orders")
  //     .where("customer_id", customerId)
  //     .orderBy("created_at", "desc")
  //     .first();

  //   return order ?? null;
  // },
  // async getOrderStageStatus({
  //   orderId,
  //   stage,
  // }: {
  //   orderId: number;
  //   stage: Stage;
  // }): Promise<StageStatus | null> {
  //   const [orderStage] = await db<OrderStage>("order_stage_statuses")
  //     .where("order_id", orderId)
  //     .andWhere("stage", stage)
  //     .orderBy("created_at", "desc")
  //     .limit(1)
  //     .select("status");

  //   if (!orderStage) return null;

  //   return orderStage.status;
  // },
  // async getOrderStageStatuses({
  //   orderId,
  //   role,
  // }: {
  //   orderId: number;
  //   role: PersonRole;
  // }) {
  //   const baseQuery = db<OrderStage>("order_stage_statuses")
  //     .select("*")
  //     .where("order_id", orderId);

  //   if (role === "modeller") {
  //     baseQuery.where("stage", "modeling");
  //   }

  //   if (role === "miller") {
  //     baseQuery.where("stage", "milling");
  //   }

  //   return await baseQuery;
  // },
};
