import { INVOICE_STATUS, PAYMENT_METHOD } from "@/constants/enums.constants";
import { createInvoiceSchema } from "@/validators/finance.validator";
import z from "zod";

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export interface Invoice {
  id: number;
  order_id: number;
  issued_by_id: number;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: InvoiceStatus;
  amount_paid: number | null;
  paid_at: string | null;
  invoice_url: string;
  created_at: string;
  description: string | null;
}
