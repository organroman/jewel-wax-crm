import {
  CreateExpenseSchema,
  CreateInvoiceSchema,
  Expense,
  Invoice,
} from "@/types/finance.types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { financeService } from "./finance-service";

export const useFinance = {
  createInvoice: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Invoice) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Invoice, Error, CreateInvoiceSchema>({
      mutationFn: async (data) => financeService.createInvoice(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.invoice_created"));
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        queryClient.invalidateQueries({
          queryKey: ["finance-all"],
        });
        handleOnSuccess && data && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createInvoiceMutation: mutation };
  },
  createExpense: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Expense) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Expense, Error, CreateExpenseSchema>({
      mutationFn: async (data) => financeService.createExpense(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.expense_created"));
        queryClient.invalidateQueries({
          queryKey: ["finance-all"],
        });
        handleOnSuccess && data && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createExpenseMutation: mutation };
  },
  getInvoicesByOrderId: ({
    orderId,
    enabled,
  }: {
    orderId: number;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["invoices", orderId],
      queryFn: () => financeService.getInvoicesByOrderId(orderId),
      enabled,
    });
  },
  getAllFinance: ({ query, enabled }: { query: string; enabled: boolean }) => {
    return useQuery({
      queryKey: ["finance-all", query],
      queryFn: () => financeService.getAllFinance(query),
      enabled,
    });
  },
  getAllClientPayments: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["client-payments", query],
      queryFn: () => financeService.getAllClientPayments(query),
      enabled,
    });
  },
};
