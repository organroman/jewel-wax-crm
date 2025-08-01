import {
  Expense,
  ExpenseInput,
  FinanceOrderItem,
  GetAlFinanceOptions,
  Invoice,
  InvoiceInput,
  PaymentStatus,
} from "../types/finance.type";
import { PaginatedResult } from "../types/shared.types";

import { FinanceModel } from "../models/finance-model";
import { OrderModel } from "../models/order-model";
import { ActivityLogModel } from "../models/activity-log-model";

import { definePaymentStatus, formatPerson } from "../utils/helpers";
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
  async createExpense(data: ExpenseInput, userId: number): Promise<Expense> {
    const expense = await FinanceModel.createExpense({
      ...data,
      created_by: userId,
    });

    if (data.order_id) {
      await ActivityLogModel.logAction({
        actor_id: userId || null,
        action: LOG_ACTIONS.CREATE_EXPENSE,
        target_type: LOG_TARGETS.ORDER,
        target_id: data.order_id,
        details: {
          data,
        },
      });
    }
    return expense;
  },

  async GetAllFinance({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<FinanceOrderItem>> {
    const orders = await FinanceModel.getAllFinance({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });

    const enriched = await Promise.all(
      orders.data.map(async (order) => {
        const invoices = await FinanceModel.getInvoicesByOrder(order.id);
        const expenses = await FinanceModel.getExpensesByOrder(order.id);

        const totalPaidByCustomer = invoices.reduce(
          (sum, invoice) => sum + Number(invoice.amount_paid || 0),
          0
        );
        let orderPaymentStatus: PaymentStatus = definePaymentStatus(
          totalPaidByCustomer,
          order.amount
        );

        let modelingPaymentStatus: PaymentStatus | null = null;

        if (
          order.modeller_id &&
          order.modeling_cost &&
          order.modeling_cost > 0
        ) {
          const totalPaidForModeling = expenses.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          );

          modelingPaymentStatus = definePaymentStatus(
            totalPaidForModeling,
            order.modeling_cost
          );
        }

        let printingPaymentStatus: PaymentStatus | null = null;

        if (
          order.printer_id &&
          order.printing_cost &&
          order.printing_cost > 0
        ) {
          const totalPaidForPrinting = expenses.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          );

          printingPaymentStatus = definePaymentStatus(
            totalPaidForPrinting,
            order.printing_cost
          );
        }

        const base = {
          order_id: order.id,
          order_important: order.is_important,
          order_number: order.number,
          customer: formatPerson(order, "customer"),
          order_amount: order.amount,
          order_payment_status: orderPaymentStatus,
          modeller: formatPerson(order, "modeller"),
          modeling_cost: order.modeling_cost,
          modeling_payment_status: modelingPaymentStatus,
          printer: formatPerson(order, "printer"),
          printing_cost: order.printing_cost,
          printing_payment_status: printingPaymentStatus,
        };

        return base;
      })
    );
    return {
      ...orders,
      data: enriched,
    };
  },
};
