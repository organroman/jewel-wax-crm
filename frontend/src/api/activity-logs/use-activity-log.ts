import { useQuery } from "@tanstack/react-query";
import { activityLogService } from "./activity-log-service";

export const useActivityLog = {
  getLogsByTargetAndId: ({ query }: { query: string }) => {
    return useQuery({
      queryKey: ["activity-logs", query],
      queryFn: () => activityLogService.getByTargetAndId(query),
    });
  },
};
