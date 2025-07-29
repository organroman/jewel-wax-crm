import { Invoice, InvoiceInput } from "../types/finance.type";
import { FinanceModel } from "../models/finance-model";
import { OrderModel } from "../models/order-model";
import { ActivityLogModel } from "../models/activity-log-model";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";

export const FinanceService = {
  async createInvoice({
    data,
    userId,
  }: {
    data: InvoiceInput;
    userId: number;
  }): Promise<Invoice> {
    const { payment_method, ...rest } = data;
    const today = new Date();

    let invoice: Invoice;
    if (payment_method === "card_transfer" || payment_method === "cash") {
      invoice = await FinanceModel.createInvoice({
        ...rest,
        payment_method,
        issued_by_id: userId,
        amount_paid: rest.amount,
        paid_at: today,
        status: "paid",
        created_at: today,
        updated_at: today,
      });
    } else {
      invoice = await FinanceModel.createInvoice({
        ...data,
        status: "pending",
        created_at: today,
        updated_at: today,
      });
    }

    await OrderModel.updateOrderPaymentStatus(data.order_id);

    await ActivityLogModel.logAction({
      actor_id: userId || null,
      action: LOG_ACTIONS.CREATE_INVOICE,
      target_type: LOG_TARGETS.ORDER,
      target_id: data.order_id,
      details: {
        data,
      },
    });

    return invoice;
  },

  async getInvoicesByOrderId(orderId: number): Promise<Invoice[]> {
    const invoices = await FinanceModel.getInvoicesByOrder(orderId);
    return invoices;
  },
};
