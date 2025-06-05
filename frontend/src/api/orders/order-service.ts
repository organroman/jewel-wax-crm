import { Order, PaginatedOrdersResult } from "@/types/order.types";
import { PaginatedResult } from "@/types/shared.types";
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
};
