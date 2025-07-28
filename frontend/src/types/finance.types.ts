import { PAYMENT_METHOD } from "@/constants/enums.constants";
import { createInvoiceSchema } from "@/validators/finance.validator";
import z from "zod";
import { PaymentStatus } from "./order.types";

export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export interface Invoice {
  id: number;
  order_id: number;
  issued_by_id: number;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string;
  invoice_url: string;
  created_at: string;
}
