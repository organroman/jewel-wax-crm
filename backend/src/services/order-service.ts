import { PaginatedResult } from "../types/shared.types";
import { GetAllOrdersOptions, Order, OrderBase } from "../types/orders.types";
import { OrderModel } from "../models/order-model";
import { PersonModel } from "../models/person-model";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { getFullName } from "../utils/helpers";

export const OrderService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
  }: GetAllOrdersOptions): Promise<PaginatedResult<Order>> {
    const orders = await OrderModel.getAll({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });

    const enriched = await Promise.all(
      orders.data.map(async (order: OrderBase) => {
        const image = await OrderModel.getOrderImage({ orderId: order.id });

        const safeCustomer = await PersonModel.findById(order.customer_id);
        if (!safeCustomer)
          throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);

        const { id, last_name, first_name, patronymic } = safeCustomer;

        let days = 0;

        if (!order.processing_days) {
          days = Math.ceil(
            (Date.now() - new Date(order.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );
        } else days = order.processing_days;

        return {
          ...order,
          media: image,
          customer: {
            id: id,
            fullname: getFullName(first_name, last_name, patronymic),
          },
          processing_days: days,
        };
      })
    );

    return {
      ...orders,
      data: enriched,
    };
  },
};
