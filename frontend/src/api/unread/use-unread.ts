import { useQuery } from "@tanstack/react-query";
import { unreadService } from "./unread-service";

export const useUnread = {
  getUnread: () => {
    return useQuery({
      queryKey: ["unread"],
      queryFn: async () => await unreadService.getUnread(),
      staleTime: 1000 * 60 * 30,
    });
  },
};
