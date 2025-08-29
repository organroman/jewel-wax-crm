
import apiService from "../api-service";
import { BadgePayload } from "@/types/unread.types";

export const unreadService = {
  getUnread: () => apiService.get<BadgePayload>("badges/unread"),
};
