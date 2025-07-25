import { useMutation, useQuery } from "@tanstack/react-query";
import { orderChatService } from "./order-chat-service";
import { toast } from "sonner";

export const useChat = {
  getLatestMessages: ({
    chatId,
    query,
    enabled,
  }: {
    chatId: number;
    query?: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["messages", chatId],
      queryFn: () => orderChatService.getLatestMessages({ chatId, query }),
      enabled,
    });
  },
  getChatDetails: ({
    chatId,
    enabled,
  }: {
    chatId: number;

    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["chatDetails", chatId],
      queryFn: () => orderChatService.getChatDetails({ chatId }),
      enabled,
    });
  },
  deleteChat: ({
    handleSuccess,
    t,
  }: {
    handleSuccess?: () => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation({
      mutationFn: async (id: number) => orderChatService.deleteChat(id),
      onSuccess: () => {
        toast.success(t("messages.success.order_chat_deleted"));
        handleSuccess && handleSuccess();
      },
      onError: (error) => toast.error(error.message),
    });

    return { deleteChat: mutation };
  },
};
