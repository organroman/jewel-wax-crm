import {
  ClientsReportRaw,
  ExpensesReportRaw,
  FinanceReportRaw,
  ModellingReportRaw,
  OrderReportRaw,
  PaginatedClientsReportResult,
  PaginatedExpensesReportResult,
  PaginatedFinanceReportResult,
  PaginatedModellingReportResult,
  PaginatedOrdersReportResult,
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
  getOrdersReport: async (query: string) => {
    return await apiService.get<PaginatedOrdersReportResult<OrderReportRaw>>(
      `reports/orders?${query}`
    );
  },
  getExpensesReport: async (query: string) => {
    return await apiService.get<
      PaginatedExpensesReportResult<ExpensesReportRaw>
    >(`reports/expenses?${query}`);
  },
  getFinanceReport: async (query: string) => {
    return await apiService.get<PaginatedFinanceReportResult<FinanceReportRaw>>(
      `reports/finance?${query}`
    );
  },
};
