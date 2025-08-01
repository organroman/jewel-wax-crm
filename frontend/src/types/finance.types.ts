import {
  EXPENSE_CATEGORY,
  INVOICE_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@/constants/enums.constants";
import {
  createExpenseSchema,
  createInvoiceSchema,
} from "@/validators/finance.validator";
import z from "zod";
import { OrderPerson } from "./order.types";

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORY)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;

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

export interface FinanceOrderItem {
  order_id: number;
  order_important: boolean;
  order_number: number;
  customer: OrderPerson | null;
  order_amount: number;
  order_payment_status: PaymentStatus | null;
  modeller: OrderPerson | null;
  modeling_cost?: number;
  modeling_payment_status: PaymentStatus | null;
  printer: OrderPerson | null;
  printing_cost?: number;
  printing_payment_status: PaymentStatus | null;
}

export interface Expense {
  id: number;
  order_id: number | null;
  related_person_id: number | null;
  category: ExpenseCategory;
  payment_method: PaymentMethod;
  amount: number;
  description: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
