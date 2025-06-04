import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "./order-service";
import { toast } from "sonner";

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
  toggleFavorite: ({
    orderId,
    queryClient,
    t,
  }: {
    orderId: number;
    queryClient: QueryClient;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<{ message: string }, Error>({
      mutationFn: async () => orderService.toggleFavorite(orderId),
      onSuccess: (data) => {
        const message = data.message;
        toast.success(t(`messages.success.${message}`));
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

    return { toggleFavoriteMutation: mutation };
  },
};
