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
  UpdateOrderInput,
  UserOrder,
} from "../types/orders.types";

import db from "../db/db";
import { paginateQuery } from "../utils/pagination";
import { PersonRole } from "../types/person.types";
import {
  getFullName,
  getVisibleFieldsForRoleAndContext,
} from "../utils/helpers";
import { PersonModel } from "./person-model";

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

    if (filters?.payment_status && filters.payment_status.length > 0) {
      baseQuery.whereIn("payment_status", filters.payment_status);
    }

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("orders.name", `%${search}%`).orWhereILike(
          "orders.number",
          `%${search}%`
        );
      });
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
  async getById({
    orderId,
    role,
    userId,
  }: {
    orderId: number;
    role: PersonRole;
    userId: number;
  }): Promise<AdminOrder | UserOrder | null> {
    const [order] = await db<OrderBase>("orders").where("id", orderId);

    if (!order) return null;

    const favorite = await db<OrderFavorite>("order_favorites")
      .where("person_id", userId)
      .andWhere("order_id", orderId)
      .first();

    const is_favorite = favorite ? true : false;
    const media = await this.getOrderImages({ orderId });

    const customerFull = await PersonModel.findById(order.customer_id);

    const customer = customerFull
      ? {
          id: customerFull?.id,
          fullname: getFullName(
            customerFull?.first_name,
            customerFull?.last_name,
            customerFull?.patronymic
          ),
          delivery_addresses: customerFull.delivery_addresses
            ? customerFull.delivery_addresses?.map((i) => ({
                delivery_address_id: i.id,
                address_line: i.address_line,
              }))
            : [],
        }
      : null;

    const modellerFull =
      order.modeller_id && (await PersonModel.findById(order.modeller_id));

    const modeller = modellerFull
      ? {
          id: modellerFull?.id,
          fullname: getFullName(
            modellerFull?.first_name,
            modellerFull?.last_name,
            modellerFull?.patronymic
          ),
        }
      : null;

    const millerFull =
      order.miller_id && (await PersonModel.findById(order.miller_id));

    const miller = millerFull
      ? {
          id: millerFull?.id,
          fullname: getFullName(
            millerFull?.first_name,
            millerFull?.last_name,
            millerFull?.patronymic
          ),
        }
      : null;

    const printerFull =
      order.printer_id && (await PersonModel.findById(order.printer_id));

    const printer = printerFull
      ? {
          id: printerFull?.id,
          fullname: getFullName(
            printerFull?.first_name,
            printerFull?.last_name,
            printerFull?.patronymic
          ),
        }
      : null;

    const createdByFull = await PersonModel.findById(order.created_by);
    const createdBy = getFullName(
      createdByFull?.first_name,
      createdByFull?.last_name,
      createdByFull?.patronymic
    );

    const stages = await db<OrderStage>("order_stage_statuses").where(
      "order_id",
      orderId
    );

    const activeStageStatus = stages.find(
      (stage) => stage.stage === order.active_stage
    )?.status;

    const [delivery] = await db<OrderDelivery>("order_deliveries")
      .where("order_id", orderId)
      .join(
        "delivery_addresses",
        "delivery_addresses.id",
        "order_deliveries.delivery_address_id"
      );

    const linked_orders = await db<LinkedOrder>("order_links")
      .where("order_id", orderId)
      .leftJoin("orders", "orders.id", "order_links.linked_order_id")
      .select("order_links.*", "orders.number as linked_order_number");

    const {
      customer_id,
      miller_id,
      printer_id,
      created_by,
      modeller_id,
      ...rest
    } = order;

    const enrichedOrder = {
      ...rest,
      is_favorite,
      media,
      customer: customer,
      modeller,
      miller,
      printer,
      stages,
      active_stage_status: activeStageStatus || null,
      processing_days:
        order.processing_days ??
        Math.ceil(
          (Date.now() - new Date(order.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      delivery,
      linked_orders,
      createdBy,
    };

    return enrichedOrder;
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

    let status: "unpaid" | "partly_paid" | "paid" = "unpaid";

    if (totalPaid === 0) status = "unpaid";
    else if (totalPaid >= orderAmount) status = "paid";
    else status = "partly_paid";

    await db("orders").update({ payment_status: status }).where("id", orderId);
  },

  async update(
    orderId: number,
    userId: number,
    role: PersonRole,
    data: UpdateOrderInput
  ): Promise<AdminOrder | UserOrder | null> {
    const {
      customer,
      created_by,
      processing_days,
      miller,
      modeller,
      printer,
      stages,
      delivery,
      linked_orders,
      ...orderFields
    } = data;

    const isOrderCompleted =
      stages?.find((stage) => stage.stage === "done")?.status === "done";

    const [updatedOrder] = await db<OrderBase>("orders")
      .where("id", orderId)
      .update({
        ...orderFields,
        updated_at: new Date(),
        customer_id: customer?.id,
        created_by: userId,
        miller_id: miller?.id ?? null,
        modeller_id: modeller?.id ?? null,
        printer_id: printer?.id ?? null,
        processing_days: isOrderCompleted
          ? Math.ceil(
              (Date.now() - new Date(data.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      })
      .returning("*");

    if (!updatedOrder) {
      return null;
    }
    if (linked_orders?.length) {
      await db<LinkedOrder>("order_links")
        .where("order_id", updatedOrder.id)
        .del();
      await db<LinkedOrder>("order_links").insert(
        linked_orders.map((lo) => ({
          ...lo,
          order_id: updatedOrder.id,
        }))
      );
    }

    if (stages?.length) {
      await Promise.all(
        stages.map(async (s) => {
          const isStageStarted =
            !s.started_at &&
            s.status &&
            [
              "clarification",
              "in_process",
              "negotiation",
              "pending",
              "processed",
            ].includes(s.status);

          const isStageCompleted = s.status === "done" && !s.completed_at;

          if (!Object.prototype.hasOwnProperty.call(s, s.id)) {
            await db("order_stage_statuses").insert({
              stage: s.stage,
              status: s.status,
              order_id: updatedOrder.id,
              started_at: s.started_at ?? (isStageStarted ? new Date() : null),
              completed_at:
                s.completed_at ?? (isStageCompleted ? new Date() : null),
            });
          } else
            await db("order_stage_statuses")
              .where("id", s.id)
              .andWhere("stage", s.stage)
              .update({
                status: s.status,
                updated_at: new Date(),
                started_at:
                  s.started_at ?? (isStageStarted ? new Date() : null),
                completed_at:
                  s.completed_at ?? (isStageCompleted ? new Date() : null),
              });
        })
      );
    }

    if (delivery) {
      if (!Object.prototype.hasOwnProperty.call(delivery, delivery.id)) {
        await db("order_deliveries").insert({
          cost: delivery.cost,
          declaration_number: delivery.declaration_number,
          delivery_address_id: delivery.delivery_address_id,
          order_id: updatedOrder.id,
        });
      }
      await db("order_deliveries").where("order_id", orderId).update({
        delivery_address_id: delivery.delivery_address_id,
        cost: delivery.cost,
        updated_at: new Date(),
        declaration_number: delivery.declaration_number,
      });
    }

    return await OrderModel.getById({ orderId, userId, role });
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
};
