import {
  Order,
  PaginatedOrdersResult,
  UpdateOrderSchema,
} from "@/types/order.types";

import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";

export const orderService = {
  getAll: async (query: string) => {
    return await apiService.get<PaginatedOrdersResult<Order>>(
      `orders?${query}`
    );
  },

  toggleFavorite: async (orderId: number) => {
    return await apiService.post<{ message: string }>(
      `orders/${orderId}/favorite`,
      {}
    );
  },
  toggleImportant: async (orderId: number, isImportant: boolean) => {
    return apiService.patch<Order>(`orders/${orderId}/important`, {
      isImportant,
    });
  },
  getById: (id: number) => {
    return apiService.get<Order>(`orders/${id}`);
  },
  update: (data: UpdateOrderSchema) => {
    const { stages, linked_orders, ...order } = data;

    const delivery = order.delivery?.delivery_address_id
      ? order.delivery
      : null;

    const updatedStages = stages.map((s) => ({
      ...s,
      status: s.status?.value,
    }));
    
    const linked = linked_orders?.map(
      ({ is_common_delivery, id, order_id, linked_order_id, comment }) => ({
        id,
        order_id,
        linked_order_id,
        comment,
        is_common_delivery,
      })
    );
    const payload = {
      ...order,
      stages: updatedStages,
      delivery: delivery,
      linked_orders: linked,
    };
    return apiService.patch<Order>(`orders/${data.id}`, payload);
  },

  delete: (id: number) => apiService.delete(`orders/${id}`),
  getOrdersNumbers: (query: string) => {
    return apiService.get<PaginatedResult<{ id: number; number: number }>>(
      `orders/numbers?${query}`
    );
  },
};
