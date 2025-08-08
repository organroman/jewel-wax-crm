import {
  ClientsReportRaw,
  ExpensesReportRaw,
  ModellingReportRaw,
  PaginatedClientsReportResult,
  PaginatedExpensesReportResult,
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
    return await apiService.get<
      PaginatedModellingReportResult<ModellingReportRaw>
    >(`reports/modeling?${query}`);
  },
  getExpensesReport: async (query: string) => {
    return await apiService.get<
      PaginatedExpensesReportResult<ExpensesReportRaw>
    >(`reports/expenses?${query}`);
  },
};
