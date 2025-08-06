import { ClientsReportRaw, PaginatedReportResult } from "@/types/report.types";

import apiService from "../api-service";

export const reportService = {
  getClientsReport: async (query: string) => {
    return await apiService.get<PaginatedReportResult<ClientsReportRaw>>(
      `reports/clients?${query}`
    );
  },
};
