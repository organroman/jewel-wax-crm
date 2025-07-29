import db from "../db/db";
import { Invoice, InvoiceInput } from "../types/finance.type";

export const FinanceModel = {
  async createInvoice(data: InvoiceInput): Promise<Invoice> {
    const [invoice] = await db<Invoice>("invoices").insert(data).returning("*");
    return invoice;
  },

  async getInvoicesByOrder(orderId: number): Promise<Invoice[]> {
    const invoices = await db<Invoice>("invoices")
      .where("order_id", orderId)
      .select("*");
    return invoices;
  },
};
