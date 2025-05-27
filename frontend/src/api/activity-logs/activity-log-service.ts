import { ActivityLog } from "@/types/activity-log.types";
import apiService from "../api-service";

export const activityLogService = {
  getByTargetAndId: async (query: string) => {
    return await apiService.get<ActivityLog[]>(`activity-logs?${query}`);
  },
};
