import { useQuery } from "@tanstack/react-query";
import { requestService } from "./request-service";

export const useRequest = {
  getConversations: ({
    query,
    enabled,
  }: {
    query?: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["requests", query],
      queryFn: () => requestService.getConversations(query),
      enabled,
    });
  },
  getMessages: ({
    conversationId,
    enabled,
  }: {
    conversationId: number;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["request-messages", conversationId],
      queryFn: () => requestService.getMessages(conversationId),
      enabled,
    });
  },
};
