import { PaginatedResult } from "../types/shared.types";
import {
  GetAllOrdersOptions,
  Order,
  OrderBase,
  OrderFavorite,
  OrderMedia,
  OrderStage,
  Stage,
  StageStatus,
} from "../types/orders.types";

import db from "../db/db";
import { paginateQuery } from "../utils/pagination";
import { PersonRole } from "../types/person.types";
import { getVisibleFieldsForRoleAndContext } from "../utils/helpers";

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

      qb.leftJoin(
        db.raw(`LATERAL (
            SELECT *
            FROM order_media
            WHERE order_media.order_id = orders.id
            ORDER BY created_at ASC
            LIMIT 1
          ) as media`),
        db.raw("true")
      );
      qb.select("media");

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

      // Join people
      const joins = ["customer", "modeller", "miller", "printer"];
      joins.forEach((role) => {
        if (visibleFields.includes(`${role}_id`)) {
          qb.leftJoin(
            `persons as ${role}s`,
            `${role}s.id`,
            `orders.${role}_id`
          ).select(
            `${role}s.id as ${role}_id`,
            `${role}s.first_name as ${role}_first_name`,
            `${role}s.last_name as ${role}_last_name`,
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

    if (search) {
      baseQuery.whereILike("orders.name", `%${search}%`);
    }

    return paginateQuery(baseQuery, { page, limit, sortBy, order });
  },

  async getOrderStageStatus({
    orderId,
    stage,
  }: {
    orderId: number;
    stage: Stage;
  }): Promise<StageStatus | null> {
    const [orderStage] = await db<OrderStage>("order_stage_statuses")
      .where("order_id", orderId)
      .andWhere("stage", stage)
      .orderBy("created_at", "desc")
      .limit(1)
      .select("status");

    if (!orderStage) return null;

    return orderStage.status;
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

  async getOrderStageStatuses({
    orderId,
    role,
  }: {
    orderId: number;
    role: PersonRole;
  }) {
    const baseQuery = db<OrderStage>("order_stage_statuses")
      .select("*")
      .where("order_id", orderId);

    if (role === "modeller") {
      baseQuery.where("stage", "modeling");
    }

    if (role === "miller") {
      baseQuery.where("stage", "milling");
    }

    return await baseQuery;
  },
  async getOrderImages({
    orderId,
  }: {
    orderId: number;
  }): Promise<OrderMedia[]> {
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
  }): Promise<Order> {
    const [updatedOrder] = await db<Order>("orders")
      .where("id", orderId)
      .update({ is_important: isImportant, updated_at: new Date() })
      .returning<Order[]>("*");

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

    let status: "unpaid" | "partly_paid" | "paid" = "unpaid";

    if (totalPaid === 0) status = "unpaid";
    else if (totalPaid >= orderAmount) status = "paid";
    else status = "partly_paid";

    await db("orders").update({ payment_status: status }).where("id", orderId);
  },

  //TODO: DELETE
  async syncAllOrderPaymentStatuses() {
    const orders = await db("orders").select("id");
    for (const order of orders) {
      await OrderModel.updateOrderPaymentStatus(order.id);
    }
  },
};
