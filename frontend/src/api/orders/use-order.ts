import { Order } from "@/types/order.types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
  toggleImportant: ({
    orderId,
    queryClient,
    t,
  }: {
    orderId: number;
    queryClient: QueryClient;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Order, Error, boolean>({
      mutationFn: async (data) => orderService.toggleImportant(orderId, data),
      onSuccess: (data) => {
        toast.success(
          t(
            `messages.success.${
              data.is_important ? "important_added" : "important_removed"
            }`
          )
        );
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { toggleImportantMutation: mutation };
  },
  getById: ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
      queryKey: ["orders", id],
      queryFn: () => orderService.getById(Number(id)),
      enabled,
    });
  },
  delete: ({
    queryClient,
    handleSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleSuccess?: () => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation({
      mutationFn: async (id: number) => orderService.delete(id),
      onSuccess: () => {
        toast.success(t("messages.success.order_deleted"));
        handleSuccess && handleSuccess(),
          queryClient.invalidateQueries({
            queryKey: ["orders"],
          });
      },
      onError: (error) => toast.error(error.message),
    });

    return { deleteOrderMutation: mutation };
  },
};
