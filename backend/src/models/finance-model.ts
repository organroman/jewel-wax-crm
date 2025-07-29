import db from "../db/db";
import { Invoice, InvoiceInput } from "../types/finance.type";

export const FinanceModel = {
  async createInvoice(data: InvoiceInput): Promise<Invoice> {
    const [invoice] = await db<Invoice>("invoices").insert(data).returning("*");
    return invoice;
  },
};
