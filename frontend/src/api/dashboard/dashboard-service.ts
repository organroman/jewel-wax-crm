import { DashboardIndicators } from "@/types/dashboard.types";
import apiService from "../api-service";

export const dashboardService = {
  getAll: async () => {
    return await apiService.get<DashboardIndicators>(`dashboard`);
  },
};
