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
    const baseQuery = db<Order>("orders")
      .select(
        "orders.*",
        db.raw(
          `CASE WHEN order_favorites.person_id IS NOT NULL THEN true ELSE false END as is_favorite`
        )
      )
      .leftJoin("order_favorites", function () {
        this.on("order_favorites.order_id", "=", "orders.id").andOn(
          "order_favorites.person_id",
          "=",
          db.raw("?", [user_id])
        );
      });

    if (user_role === "modeller") {
      baseQuery.join("order_services as os", function () {
        this.on("os.order_id", "=", "orders.id")
          .andOn("os.person_id", "=", db.raw("?", [user_id]))
          .andOn("os.type", "=", db.raw("?", ["modeling"]));
      });
    }

    //todo: filters by currentStage

    if (filters?.is_important)
      baseQuery.where("is_important", filters.is_important);

    //todo: search
    const paginated = await paginateQuery<OrderBase>(baseQuery, {
      page,
      limit,
      order,
      sortBy,
    });
    return paginated;
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
};
