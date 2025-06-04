import { useQuery } from "@tanstack/react-query";
import { orderService } from "./order-service";

export const useOrder = {
  getPaginatedOrders: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["orders", query],
      queryFn: () => orderService.getAll(query),
      enabled,
    });
  },
};
