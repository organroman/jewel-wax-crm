import {
  AdminOrder,
  GetAllOrdersOptions,
  Order,
  PaginatedOrdersResult,
  UserOrder,
} from "../types/orders.types";
import { OrderModel } from "../models/order-model";
import { formatPerson } from "../utils/helpers";

export const OrderService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
    user_id,
    user_role,
  }: GetAllOrdersOptions): Promise<
    PaginatedOrdersResult<AdminOrder | UserOrder>
  > {
    const [orders, stageCounts] = await Promise.all([
      OrderModel.getAll({
        page,
        limit,
        filters,
        search,
        sortBy,
        order,
        user_id,
        user_role,
      }),
      OrderModel.countByStage("done"),
    ]);

    const stageMap = await OrderModel.getOrderStagesForOrders(
      orders.data.map((o) => o.id),
      user_role
    );

    const enriched = orders.data.map((order) => {
      const base = {
        ...order,
        stages: stageMap[order.id] ?? [],
        processing_days:
          order.processing_days ??
          Math.ceil(
            (Date.now() - new Date(order.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        customer: formatPerson(order, "customer"),
        modeller: formatPerson(order, "modeller"),
        miller: formatPerson(order, "miller"),
        printer: formatPerson(order, "printer"),
      };

      if (user_role === "modeller") {
        const {
          customer_id,
          miller_id,
          printer_id,
          modeller_id,
          modeller_first_name,
          modeller_last_name,
          modeller_patronymic,
          ...cleaned
        } = base;
        return cleaned;
      }

      if (user_role === "miller") {
        const {
          customer_id,
          modeller_id,
          printer_id,
          miller_id,
          miller_first_name,
          miller_last_name,
          miller_patronymic,
          ...cleaned
        } = base;
        return cleaned;
      }

      if (user_role === "super_admin") {
        const {
          modeller_id,
          miller_id,
          printer_id,
          customer_id,
          miller_first_name,
          miller_last_name,
          miller_patronymic,
          modeller_first_name,
          modeller_last_name,
          modeller_patronymic,
          customer_first_name,
          customer_last_name,
          customer_patronymic,
          printer_first_name,
          printer_last_name,
          printer_patronymic,
          ...cleaned
        } = base;
        return cleaned;
      }

      return base;
    });
    return {
      ...orders,
      data: enriched,
      stage_counts: stageCounts,
    };
  },
  async toggleFavorite({
    orderId,
    personId,
  }: {
    orderId: number;
    personId: number;
  }): Promise<{ status: string; orderId: number }> {
    return await OrderModel.toggleFavorite({ orderId, personId });
  },

  async toggleImportant({
    orderId,
    isImportant,
  }: {
    orderId: number;
    isImportant: boolean;
  }): Promise<Order> {
    return await OrderModel.toggleImportant({ orderId, isImportant });
  },
};
