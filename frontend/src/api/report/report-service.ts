import {
  ClientsReportRaw,
  ModellingReportRaw,
  PaginatedClientsReportResult,
  PaginatedModellingReportResult,
} from "@/types/report.types";

import apiService from "../api-service";

export const reportService = {
  getClientsReport: async (query: string) => {
    return await apiService.get<PaginatedClientsReportResult<ClientsReportRaw>>(
      `reports/clients?${query}`
    );
  },
  getModelingReport: async (query: string) => {
    return await apiService.get<PaginatedModellingReportResult<ModellingReportRaw>>(`reports/modeling?${query}`);
  },
};
