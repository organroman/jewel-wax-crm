import { Conversation, Message } from "@/types/request.types";
import apiService from "../api-service";

export const requestService = {
  getConversations: async (query?: string) => {
    return await apiService.get<Conversation[]>(`chat/conversations?${query}`);
  },
  getMessages: async (conversationId: number) => {
    return await apiService.get<Message[]>(
      `chat/conversations/${conversationId}/messages`
    );
  },
};
