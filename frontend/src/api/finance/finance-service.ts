import {
  CreateExpenseSchema,
  CreateInvoiceSchema,
  Expense,
  FinanceClientPaymentItem,
  FinanceModellerPaymentItem,
  FinanceOrderItem,
  Invoice,
} from "@/types/finance.types";
import { PaginatedResult } from "@/types/shared.types";

import apiService from "../api-service";

export const financeService = {
  createInvoice: (data: CreateInvoiceSchema) =>
    apiService.post<Invoice>("finance/invoices", {
      order_id: data.order?.id,
      amount: data.amount,
      description: data.description ?? null,
      payment_method: data.payment_method.value,
    }),
  getInvoicesByOrderId: async (orderId: number) => {
    return await apiService.get<Invoice[]>(`finance/invoices/${orderId}`);
  },
  createExpense: async (data: CreateExpenseSchema) => {
    return await apiService.post<Expense>("finance/expenses", {
      order_id: data.order?.id ?? null,
      related_person_id: data.person?.id ?? null,
      category: data.category.value,
      amount: data.amount,
      description: data.description ?? null,
      payment_method: data.payment_method.value,
    });
  },
  getAllFinance: async (query: string) => {
    return await apiService.get<PaginatedResult<FinanceOrderItem>>(
      `finance/all-finance?${query}`
    );
  },
  getAllClientPayments: async (query: string) => {
    return await apiService.get<PaginatedResult<FinanceClientPaymentItem>>(
      `finance/client-payments?${query}`
    );
  },
  getAllModellerPayments: async (query: string) => {
    return await apiService.get<PaginatedResult<FinanceModellerPaymentItem>>(
      `finance/modeller-payments?${query}`
    );
  },
};
