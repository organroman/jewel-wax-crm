import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard-service";

export const useDashboard = {
  getAll: ({ enabled }: { enabled: boolean }) => {
    return useQuery({
      queryKey: ["dashboard"],
      queryFn: () => dashboardService.getAll(),
      enabled,
    });
  },
};
