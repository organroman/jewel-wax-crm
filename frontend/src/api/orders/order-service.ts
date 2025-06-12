import {
  Order,
  PaginatedOrdersResult,
  UpdateOrderSchema,
} from "@/types/order.types";

import apiService from "../api-service";

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
    const { stages, ...order } = data;

    const delivery = order.delivery?.delivery_address_id
      ? order.delivery
      : null;

    const updatedStages = stages.map((s) => ({
      ...s,
      status: s.status?.value,
    }));
    const payload = {
      ...order,
      stages: updatedStages,
      delivery: delivery,
    };
    return apiService.patch<Order>(`orders/${data.id}`, payload);
  },

  delete: (id: number) => apiService.delete(`orders/${id}`),
};
