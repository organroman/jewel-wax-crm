import { INVOICE_STATUS, PAYMENT_METHOD } from "../constants/enums";

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

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
