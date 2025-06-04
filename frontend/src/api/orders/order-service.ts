import { Order } from "@/types/order.types";
import { PaginatedResult } from "@/types/shared.types";
import apiService from "../api-service";

export const orderService = {
  getAll: async (query: string) => {
    return await apiService.get<PaginatedResult<Order>>(`orders?${query}`);
  },

  toggleFavorite: async (orderId: number) => {
    return await apiService.post<{ message: string }>(
      `orders/${orderId}/favorite`,
      {}
    );
  },
};
