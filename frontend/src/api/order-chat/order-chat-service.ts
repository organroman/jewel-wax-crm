import { ChatDetails, ChatMessage } from "@/types/order-chat.types";
import apiService from "../api-service";

export const orderChatService = {
  getLatestMessages: async ({
    chatId,
    query,
  }: {
    chatId: number;
    query?: string;
  }) => {
    return await apiService.get<ChatMessage[]>(
      `chats/${chatId}/messages?${query}`
    );
  },
  getChatDetails: async ({ chatId }: { chatId: number }) => {
    return await apiService.get<ChatDetails>(`chats/${chatId}/details`);
  },
  deleteChat: async (chatId: number) => apiService.delete(`chats/${chatId}`),
};
