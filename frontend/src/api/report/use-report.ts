import { useQuery } from "@tanstack/react-query";
import { reportService } from "./report-service";

export const useReport = {
  getClientsReport: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["clients-report", query],
      queryFn: () => reportService.getClientsReport(query),
      enabled,
    });
  },
  getModelingReport: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["modeling-report", query],
      queryFn: () => reportService.getModelingReport(query),
      enabled,
    });
  },
  getOrdersReport: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["orders-report", query],
      queryFn: () => reportService.getOrdersReport(query),
      enabled,
    });
  },
  getExpensesReport: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["expenses-report", query],
      queryFn: () => reportService.getExpensesReport(query),
      enabled,
    });
  },
  getFinanceReport: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["finance-report", query],
      queryFn: () => reportService.getFinanceReport(query),
      enabled,
    });
  },
};
