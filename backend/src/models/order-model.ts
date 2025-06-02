import { PaginatedResult } from "../types/shared.types";
import {
  GetAllOrdersOptions,
  Order,
  OrderBase,
  OrderMedia,
  OrderStage,
  Stage,
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
  }: GetAllOrdersOptions): Promise<PaginatedResult<OrderBase>> {
    const baseQuery = db<Order>("orders").select("*");

    //todo: filters by currentStage

    if (filters?.is_favorite)
      baseQuery.where("is_favorite", filters.is_favorite);

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
  }): Promise<Stage | null> {
    const [orderStage] = await db<OrderStage>("order_stage_statuses")
      .where("order_id", orderId)
      .andWhere("stage", stage)
      .orderBy("created_at", "desc")
      .limit(1)
      .select("stage");

    if (!orderStage) return null;

    return orderStage.stage;
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
};
