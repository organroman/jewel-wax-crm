import { CreateInvoiceSchema, Invoice } from "@/types/finance.types";
import apiService from "../api-service";

export const financeService = {
  createInvoice: (data: CreateInvoiceSchema) =>
    apiService.post<Invoice>("finance/invoices", {
      ...data,
      payment_method: data.payment_method.value,
    }),
};
