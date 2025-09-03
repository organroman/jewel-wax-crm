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
import { PersonModel } from "../models/person/person-model";

import {
  definePaymentAmountByPaymentMethod,
  definePaymentStatus,
  formatPerson,
  getFullName,
  groupBy,
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

    const allOrderIds = orders.data.map((o) => o.id);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(allOrderIds);
    const allExpenses = await FinanceModel.getExpensesByOrderIds(allOrderIds);
    const invoicesByOrder = groupBy(allInvoices, "order_id");
    const expensesByOrderId = groupBy(allExpenses, "order_id");

    const enriched = orders.data.map((order) => {
      const invoices = invoicesByOrder[order.id] ?? [];
      const modelingExpenses =
        expensesByOrderId[order.id]?.filter(
          (o) => o.category === "modelling"
        ) ?? [];
      const printingExpenses =
        expensesByOrderId[order.id]?.filter((o) => o.category === "printing") ??
        [];

      const totalPaidByCustomer = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid || 0),
        0
      );
      let orderPaymentStatus: PaymentStatus = definePaymentStatus(
        totalPaidByCustomer,
        order.amount
      );

      let modelingPaymentStatus: PaymentStatus | null = null;

      if (order.modeller_id && order.modeling_cost && order.modeling_cost > 0) {
        const totalPaidForModeling = modelingExpenses.reduce(
          (sum, expense) => sum + Number(expense.amount || 0),
          0
        );

        modelingPaymentStatus = definePaymentStatus(
          totalPaidForModeling,
          order.modeling_cost
        );
      }

      let printingPaymentStatus: PaymentStatus | null = null;

      if (order.printer_id && order.printing_cost && order.printing_cost > 0) {
        const totalPaidForPrinting = printingExpenses.reduce(
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
    });

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

    const allOrderIds = orders.data.map((o) => o.id);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(allOrderIds);
    const invoicesByOrder = groupBy(allInvoices, "order_id");

    const enriched = orders.data.map((order) => {
      const invoices = invoicesByOrder[order.id] ?? [];

      const totalPaidByCustomer = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid || 0),
        0
      );
      let orderPaymentStatus: PaymentStatus = definePaymentStatus(
        totalPaidByCustomer,
        order.amount
      );

      const debt = order.amount - totalPaidByCustomer;

      const {
        transactionsAmount: cashAmount,
        transactionsPaymentsAmount: cashPaymentsAmount,
        transactionLastPaymentDate: cashLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(invoices, "cash", {
        amountField: "amount_paid",
        dateField: "paid_at",
      });

      const {
        transactionsAmount: cardInvoicesAmount,
        transactionsPaymentsAmount: cardPaymentsAmount,
        transactionLastPaymentDate: cardLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(invoices, "card_transfer", {
        amountField: "amount_paid",
        dateField: "paid_at",
      });

      const {
        transactionsAmount: bankInvoicesAmount,
        transactionsPaymentsAmount: bankPaymentsAmount,
        transactionLastPaymentDate: bankLastPaymentDate,
      } = definePaymentAmountByPaymentMethod(
        invoices,
        ["payment_system", "bank_transfer"],
        {
          amountField: "amount_paid",
          dateField: "paid_at",
        }
      );

      const { transactionLastComment } = definePaymentAmountByPaymentMethod(
        invoices,
        ["bank_transfer", "card_transfer", "cash", "payment_system"],
        {
          amountField: "amount_paid",
          dateField: "paid_at",
        }
      );

      const base = {
        order_id: order.id,
        order_important: order.is_important,
        order_number: order.number,
        customer: formatPerson(order, "customer"),
        order_amount: order.amount,
        order_payment_status: orderPaymentStatus,
        cash_amount: cashAmount,
        cash_payments_amount: cashPaymentsAmount,
        cash_payment_date: cashLastPaymentDate,
        card_amount: cardInvoicesAmount,
        card_payments_amount: cardPaymentsAmount,
        card_payment_date: cardLastPaymentDate,
        bank_amount: bankInvoicesAmount,
        bank_payments_amount: bankPaymentsAmount,
        bank_payment_date: bankLastPaymentDate,
        debt,
        last_payment_comment: transactionLastComment,
      };

      return base;
    });

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

    const allOrderIds = orders.data.map((o) => o.id);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(allOrderIds);
    const allExpenses = await FinanceModel.getExpensesByOrderIds(allOrderIds);
    const invoicesByOrder = groupBy(allInvoices, "order_id");
    const expensesByOrderId = groupBy(allExpenses, "order_id");

    const enriched = orders.data.map((order) => {
      const invoices = invoicesByOrder[order.id] ?? [];
      const expenses =
        expensesByOrderId[order.id]?.filter(
          (exp) => exp.category === "modelling"
        ) ?? [];

      const totalPaidByCustomer = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid || 0),
        0
      );
      let orderPaymentStatus: PaymentStatus = definePaymentStatus(
        totalPaidByCustomer,
        order.amount
      );

      let modelingPaymentStatus: PaymentStatus = "unpaid";

      if (order.modeller_id && order.modeling_cost && order.modeling_cost > 0) {
        const totalPaidForModeling = expenses.reduce(
          (sum, expense) => sum + Number(expense.amount || 0),
          0
        );

        modelingPaymentStatus = definePaymentStatus(
          totalPaidForModeling,
          order.modeling_cost
        );
      }

      const { transactionLastComment, transactionLastPaymentDate } =
        definePaymentAmountByPaymentMethod(
          expenses,
          ["bank_transfer", "card_transfer", "cash", "payment_system"],
          {
            amountField: "amount",
            dateField: "created_at",
          }
        );

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
        last_payment_date: transactionLastPaymentDate,
        last_payment_comment: transactionLastComment,
      };

      return base;
    });

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

    const allOrderIds = orders.data.map((o) => o.id);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(allOrderIds);
    const allExpenses = await FinanceModel.getExpensesByOrderIds(allOrderIds);
    const invoicesByOrder = groupBy(allInvoices, "order_id");
    const expensesByOrderId = groupBy(allExpenses, "order_id");

    const enriched = orders.data.map((order) => {
      const invoices = invoicesByOrder[order.id] ?? [];
      const expenses =
        expensesByOrderId[order.id]?.filter(
          (exp) => exp.category === "printing"
        ) ?? [];

      const totalPaidByCustomer = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid || 0),
        0
      );
      let orderPaymentStatus: PaymentStatus = definePaymentStatus(
        totalPaidByCustomer,
        order.amount
      );

      let printingPaymentStatus: PaymentStatus = "unpaid";

      if (order.printer_id && order.printing_cost && order.printing_cost > 0) {
        const totalPaidForModeling = expenses.reduce(
          (sum, expense) => sum + Number(expense.amount || 0),
          0
        );

        printingPaymentStatus = definePaymentStatus(
          totalPaidForModeling,
          order.printing_cost
        );
      }

      const { transactionLastComment, transactionLastPaymentDate } =
        definePaymentAmountByPaymentMethod(
          expenses,
          ["bank_transfer", "card_transfer", "cash", "payment_system"],
          {
            amountField: "amount",
            dateField: "created_at",
          }
        );

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
        last_payment_date: transactionLastPaymentDate,
        last_payment_comment: transactionLastComment,
      };

      return base;
    });

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

    const allExpensesOrderIds = expenses.data
      .map((t) => t.order_id)
      .filter((t) => t !== null);

    const allExpensesRelatedPersonIds = expenses.data
      .map((t) => t.related_person_id)
      .filter((t) => t !== null);

    const allOrders = await OrderModel.getOrdersBaseByIds(allExpensesOrderIds);
    const allPersons = await PersonModel.getPersonsBaseByIds(
      allExpensesRelatedPersonIds
    );

    const enriched = expenses.data.map((expense) => {
      const { order_id, related_person_id, ...rest } = expense;

      const order = allOrders.find((o) => o.id === order_id);

      const person = allPersons.find((p) => p.id === related_person_id);

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
    });

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

    const allTransactionsOrderIds = transactions.data
      .map((t) => t.order_id)
      .filter((t) => t !== null);

    const allTransactionsRelatedPersonIds = transactions.data
      .map((t) => t.related_person_id)
      .filter((t) => t !== null);

    const allOrders = await OrderModel.getOrdersBaseByIds(
      allTransactionsOrderIds
    );

    const allCustomerIds = allOrders.map((order) => order.customer_id);

    const allPersonsIds = [
      ...allCustomerIds,
      ...allTransactionsRelatedPersonIds,
    ];

    const allPersons = await PersonModel.getPersonsBaseByIds(allPersonsIds);

    const enriched = transactions.data.map((transaction) => {
      const { order_id, related_person_id, ...rest } = transaction;

      const order = allOrders.find((o) => o.id === order_id);

      let transactionPerson: OrderPerson | null = null;

      if (
        order &&
        (rest.type === "invoice_issued" || rest.type === "invoice_paid")
      ) {
        const fullPerson = allPersons.find(
          (person) => person.id === order.customer_id
        );

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
        const fullPerson = allPersons.find((p) => p.id === related_person_id);

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
    });

    return {
      ...transactions,
      data: enriched,
    };
  },
};
