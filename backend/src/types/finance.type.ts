import {
  EXPENSE_CATEGORY,
  INVOICE_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/enums";
import { OrderPerson } from "./order.types";
import { GetAllOptions } from "./shared.types";

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORY)[number];

export interface InvoiceInput {
  order_id: number;
  issued_by_id: number;
  amount: number;
  amount_paid: number;
  payment_method: PaymentMethod;
  created_at?: Date;
  updated_at?: Date;
  paid_at?: Date;
  status?: InvoiceStatus;
  description?: string;
}

export interface Invoice {
  id: number;
  order_id: number;
  issued_by_id: number;
  amount: number;
  amount_paid: number | null;
  payment_method: PaymentMethod;
  status: InvoiceStatus;
  paid_at: Date | null;
  description: string | null;
  integration_data: string | null;
  invoice_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ExpenseInput {
  order_id?: number;
  related_person_id?: number;
  category: ExpenseCategory;
  payment_method: PaymentMethod;
  amount: number;
  description?: string;
  created_by: number;
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

export interface FinanceOrderItem {
  order_id: number;
  order_important: boolean;
  order_number: number;
  customer: OrderPerson | null;
  order_amount: number;
  order_payment_status: PaymentStatus;
  modeller: OrderPerson | null;
  modeling_cost?: number;
  modeling_payment_status: PaymentStatus | null;
  printer: OrderPerson | null;
  printing_cost?: number;
  printing_payment_status: PaymentStatus | null;
}

export interface FinanceClientPaymentItem {
  order_id: number;
  order_important: boolean;
  order_number: number;
  customer: OrderPerson | null;
  order_amount: number;
  order_payment_status: PaymentStatus;
  cash_amount: number | null;
  cash_payments_amount: number | null;
  cash_payment_date: Date | null;
  card_amount: number | null;
  card_payments_amount: number | null;
  card_payment_date: Date | null;
  bank_amount: number | null;
  bank_payments_amount: number | null;
  bank_payment_date: Date | null;
  debt: number;
  last_payment_comment: string | null;
}

export interface FinanceModellerPaymentItem {
  order_id: number;
  order_important: boolean;
  order_number: number;
  customer: OrderPerson | null;
  order_amount: number;
  order_payment_status: PaymentStatus;
  modeller: OrderPerson | null;
  modelling_cost: number | null;
  modelling_payment_status: PaymentStatus;
  last_payment_date: Date | null;
  last_payment_comment: string | null;
}

export interface GetAlFinanceOptions
  extends GetAllOptions<{
    //TODO: add options
  }> {}
