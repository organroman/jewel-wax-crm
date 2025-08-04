import {
  Expense,
  ExpenseFull,
  ExpenseInput,
  FinanceClientPaymentItem,
  FinanceModellerPaymentItem,
  FinanceOrderItem,
  FinancePrinterPaymentItem,
  FinanceTransaction,
  GetAlFinanceOptions,
  Invoice,
  InvoiceInput,
  PaymentStatus,
} from "../types/finance.type";
import { PaginatedResult } from "../types/shared.types";
import { OrderPerson } from "../types/order.types";

import { FinanceModel } from "../models/finance-model";
import { OrderModel } from "../models/order-model";
import { ActivityLogModel } from "../models/activity-log-model";
import { PersonModel } from "../models/person-model";

import {
  definePaymentStatus,
  formatPerson,
  getFullName,
} from "../utils/helpers";
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
  async getAllClientPayments({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<FinanceClientPaymentItem>> {
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

        const totalPaidByCustomer = invoices.reduce(
          (sum, invoice) => sum + Number(invoice.amount_paid || 0),
          0
        );
        let orderPaymentStatus: PaymentStatus = definePaymentStatus(
          totalPaidByCustomer,
          order.amount
        );

        const debt = order.amount - totalPaidByCustomer;

        const cash = invoices.filter((i) => i.payment_method === "cash");
        const cashInvoicesAmount = cash.length;
        const cashPaymentsAmount = cash.reduce(
          (sum, invoice) => sum + Number(invoice.amount_paid || 0),
          0
        );
        const cashLastPaymentDate =
          cash.length > 0
            ? cash
                .filter((a) => a.paid_at !== null)
                .sort((a, b) => (a.paid_at! > b.paid_at! ? -1 : 1))[0]?.paid_at
            : null;

        const card = invoices.filter(
          (i) => i.payment_method === "card_transfer"
        );
        const cardInvoicesAmount = card.length;
        const cardPaymentsAmount = card.reduce(
          (sum, invoice) => sum + Number(invoice.amount_paid || 0),
          0
        );
        const cardLastPaymentDate =
          card.length > 0
            ? card
                .filter((a) => a.paid_at !== null)
                .sort((a, b) => (a.paid_at! > b.paid_at! ? -1 : 1))[0]?.paid_at
            : null;

        const bank = invoices.filter(
          (i) =>
            i.payment_method === "payment_system" ||
            i.payment_method === "bank_transfer"
        );
        const bankInvoicesAmount = bank.length;
        const bankPaymentsAmount = bank.reduce(
          (sum, invoice) => sum + Number(invoice.amount_paid || 0),
          0
        );
        const bankLastPaymentDate =
          bank.length > 0
            ? bank
                .filter((a) => a.paid_at !== null)
                .sort((a, b) => (a.paid_at! > b.paid_at! ? -1 : 1))[0]?.paid_at
            : null;

        const lastPaymentComment =
          invoices.length > 0
            ? invoices
                .filter((a) => a.paid_at !== null)
                .sort((a, b) => (a.paid_at! > b.paid_at! ? -1 : 1))[0]
                ?.description
            : null;

        const base = {
          order_id: order.id,
          order_important: order.is_important,
          order_number: order.number,
          customer: formatPerson(order, "customer"),
          order_amount: order.amount,
          order_payment_status: orderPaymentStatus,
          cash_amount: cashInvoicesAmount,
          cash_payments_amount: cashPaymentsAmount,
          cash_payment_date: cashLastPaymentDate,
          card_amount: cardInvoicesAmount,
          card_payments_amount: cardPaymentsAmount,
          card_payment_date: cardLastPaymentDate,
          bank_amount: bankInvoicesAmount,
          bank_payments_amount: bankPaymentsAmount,
          bank_payment_date: bankLastPaymentDate,
          debt,
          last_payment_comment: lastPaymentComment,
        };

        return base;
      })
    );
    return {
      ...orders,
      data: enriched,
    };
  },
  async getAllPaymentToModeller({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<
    PaginatedResult<FinanceModellerPaymentItem>
  > {
    const orders = await FinanceModel.getAllOrdersWithPerformerByRole({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
      role: "modeller",
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

        let modelingPaymentStatus: PaymentStatus = "unpaid";

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

        const lastPaymentDate =
          expenses.length > 0
            ? expenses.sort((a, b) =>
                a.created_at! > b.created_at! ? -1 : 1
              )[0]?.created_at
            : null;

        const lastPaymentComment =
          expenses.length > 0
            ? expenses.sort((a, b) =>
                a.created_at! > b.created_at! ? -1 : 1
              )[0]?.description
            : null;

        const base = {
          order_id: order.id,
          order_important: order.is_important,
          order_number: order.number,
          customer: formatPerson(order, "customer"),
          order_amount: order.amount,
          order_payment_status: orderPaymentStatus,
          modeller: formatPerson(order, "modeller"),
          modelling_cost: order.modeling_cost ?? null,
          modelling_payment_status: modelingPaymentStatus,
          last_payment_date: lastPaymentDate,
          last_payment_comment: lastPaymentComment,
        };

        return base;
      })
    );
    return {
      ...orders,
      data: enriched,
    };
  },
  async getAllPaymentToPrinter({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<FinancePrinterPaymentItem>> {
    const orders = await FinanceModel.getAllOrdersWithPerformerByRole({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
      role: "print",
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

        let printingPaymentStatus: PaymentStatus = "unpaid";

        if (
          order.printer_id &&
          order.printing_cost &&
          order.printing_cost > 0
        ) {
          const totalPaidForModeling = expenses.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          );

          printingPaymentStatus = definePaymentStatus(
            totalPaidForModeling,
            order.printing_cost
          );
        }

        const lastPaymentDate =
          expenses.length > 0
            ? expenses.sort((a, b) =>
                a.created_at! > b.created_at! ? -1 : 1
              )[0]?.created_at
            : null;

        const lastPaymentComment =
          expenses.length > 0
            ? expenses.sort((a, b) =>
                a.created_at! > b.created_at! ? -1 : 1
              )[0]?.description
            : null;

        const base = {
          order_id: order.id,
          order_important: order.is_important,
          order_number: order.number,
          customer: formatPerson(order, "customer"),
          order_amount: order.amount,
          order_payment_status: orderPaymentStatus,
          printer: formatPerson(order, "printer"),
          printing_cost: order.printing_cost ?? null,
          printing_payment_status: printingPaymentStatus,
          last_payment_date: lastPaymentDate,
          last_payment_comment: lastPaymentComment,
        };

        return base;
      })
    );
    return {
      ...orders,
      data: enriched,
    };
  },
  async getAllExpenses({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<ExpenseFull>> {
    const expenses = await FinanceModel.getAllExpenses({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });
    const enriched = await Promise.all(
      expenses.data.map(async (expense) => {
        const { order_id, related_person_id, ...rest } = expense;
        const order = order_id
          ? await OrderModel.getOrderBaseById(order_id)
          : null;

        const person = related_person_id
          ? await PersonModel.findById(related_person_id)
          : null;

        return {
          ...rest,
          order: order
            ? {
                id: order.id,
                number: order.number,
              }
            : null,
          person: person
            ? {
                id: person.id,
                fullname: getFullName(
                  person.first_name,
                  person.last_name,
                  person.patronymic
                ),
              }
            : null,
        };
      })
    );

    return {
      ...expenses,
      data: enriched,
    };
  },
  async getTransactions({
    page,
    limit,
    filters,
    search,
    sortBy = "orders.created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<FinanceTransaction>> {
    const transactions = await FinanceModel.getTransactions({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });

    const enriched = await Promise.all(
      transactions.data.map(async (transaction) => {
        const { order_id, related_person_id, ...rest } = transaction;

        const order = order_id
          ? await OrderModel.getOrderBaseById(order_id)
          : null;

        let transactionPerson: OrderPerson | null = null;

        if (
          order_id &&
          (rest.type === "invoice_issued" || rest.type === "invoice_paid")
        ) {
          const fullPerson = order?.customer_id
            ? await PersonModel.findById(order?.customer_id)
            : null;

          if (fullPerson) {
            transactionPerson = {
              id: fullPerson.id,
              fullname: getFullName(
                fullPerson.first_name,
                fullPerson.last_name,
                fullPerson.patronymic
              ),
            };
          }
        } else if (related_person_id) {
          const fullPerson = await PersonModel.findById(related_person_id);

          if (fullPerson) {
            transactionPerson = {
              id: fullPerson.id,
              fullname: getFullName(
                fullPerson.first_name,
                fullPerson.last_name,
                fullPerson.patronymic
              ),
            };
          }
        }
        return {
          ...rest,
          order: order ? { id: order.id, number: order.number } : null,
          person: transactionPerson,
        };
      })
    );

    return {
      ...transactions,
      data: enriched,
    };
  },
};
