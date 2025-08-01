import {
  CreateInvoiceSchema,
  FinanceOrderItem,
  Invoice,
} from "@/types/finance.types";
import { PaginatedResult } from "@/types/shared.types";

import apiService from "../api-service";

export const financeService = {
  createInvoice: (data: CreateInvoiceSchema) =>
    apiService.post<Invoice>("finance/invoices", {
      ...data,
      payment_method: data.payment_method.value,
    }),
  getInvoicesByOrderId: async (orderId: number) => {
    return await apiService.get<Invoice[]>(`finance/invoices/${orderId}`);
  },
  // createExpense: (data: CreateExpenseSchema) => {
  //   apiService.post<Expense>("finance/expenses", {
  //     ...data,
  //     payment_method: data.payment_method.value,
  //   });
  // },
  getAllFinance: async (query: string) => {
    return await apiService.get<PaginatedResult<FinanceOrderItem>>(
      `finance/all-finance?${query}`
    );
  },
};
