import { OrderBase } from "../types/order.types";
import {
  Expense,
  ExpenseCategory,
  ExpenseInput,
  FinanceTransactionRaw,
  GetAlFinanceOptions,
  Invoice,
  InvoiceInput,
} from "../types/finance.type";
import { PaginatedResult } from "../types/shared.types";

import db from "../db/db";

import { paginateQuery } from "../utils/pagination";

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

  async getInvoicesByOrderIds(orderIds: number[]): Promise<Invoice[]> {
    const invoices = await db<Invoice>("invoices")
      .whereIn("order_id", orderIds)
      .select("*");
    return invoices;
  },

  async getInvoicesPaidInPeriod(from: Date, to: Date): Promise<Invoice[]> {
    const invoices = await db<Invoice>("invoices")
      .whereBetween("paid_at", [from, to])
      .select("*");
    return invoices;
  },

  async createExpense(data: ExpenseInput): Promise<Expense> {
    const [expense] = await db<Expense>("expenses").insert(data).returning("*");
    return expense;
  },

  async getExpensesByOrder(
    orderId: number,
    expenseType?: ExpenseCategory
  ): Promise<Expense[]> {
    const baseQuery = db<Expense>("expenses")
      .where("order_id", orderId)
      .select("*");

    if (expenseType) {
      baseQuery.where("category", expenseType);
    }
    return await baseQuery;
  },

  async getExpensesByOrderIds(
    orderIds: number[],
    expenseType?: ExpenseCategory
  ): Promise<Expense[]> {
    const baseQuery = db<Expense>("expenses")
      .whereIn("order_id", orderIds)
      .select("*");

    if (expenseType) {
      baseQuery.where("category", expenseType);
    }
    return await baseQuery;
  },

  async getAllFinance({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<OrderBase>> {
    const baseQuery = db<OrderBase>("orders").modify((qb) => {
      const joins = ["customer", "modeller", "miller", "printer"];
      joins.forEach((role) => {
        qb.leftJoin(
          `persons as ${role}s`,
          `${role}s.id`,
          `orders.${role}_id`
        ).select(
          `${role}s.id as ${role}_id`,
          `${role}s.last_name as ${role}_last_name`,
          `${role}s.first_name as ${role}_first_name`,
          `${role}s.patronymic as ${role}_patronymic`
        );
      });
      qb.select("orders.*");
    });

    //todo filters, search
    return paginateQuery(baseQuery, { page, limit, sortBy, order });
  },
  async getAllOrdersWithPerformerByRole({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
    role,
  }: GetAlFinanceOptions): Promise<PaginatedResult<OrderBase>> {
    const roleInOrder = role === "print" ? "printer" : role;
    const baseQuery = db<OrderBase>("orders")
      .whereNotNull(`${roleInOrder}_id`)
      .modify((qb) => {
        const joins = ["customer", roleInOrder];
        joins.forEach((role) => {
          qb.leftJoin(
            `persons as ${role}s`,
            `${role}s.id`,
            `orders.${role}_id`
          ).select(
            `${role}s.id as ${role}_id`,
            `${role}s.last_name as ${role}_last_name`,
            `${role}s.first_name as ${role}_first_name`,
            `${role}s.patronymic as ${role}_patronymic`
          );
        });
        qb.select("orders.*");
      });

    //todo filters, search
    return paginateQuery(baseQuery, { page, limit, sortBy, order });
  },
  async getAllExpenses({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<Expense>> {
    const baseQuery = db<Expense>("expenses").select("*");

    //todo filters, search
    return await paginateQuery<Expense>(baseQuery, {
      page,
      limit,
      sortBy,
      order,
    });
  },
  async getTransactions({
    page = 1,
    limit = 10,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAlFinanceOptions): Promise<PaginatedResult<FinanceTransactionRaw>> {
    const baseQueryExpenses = db<FinanceTransactionRaw>("expenses").select(
      "id",
      db.raw("'expense' as type"),
      "amount",
      "created_at",
      "payment_method",
      "description",
      "order_id",
      "related_person_id"
    );
    const baseQueryInvoices = db<FinanceTransactionRaw>("invoices").select(
      "id",
      db.raw("'invoice_issued' as type"),
      "amount",
      "created_at",
      "payment_method",
      "description",
      "order_id",
      db.raw("null as related_person_id")
    );

    const baseQueryPaidInvoices = db<FinanceTransactionRaw>("invoices")
      .whereNotNull("paid_at")
      .select(
        "id",
        db.raw("'invoice_paid' as type"),
        "amount",
        "paid_at as created_at",
        "payment_method",
        "description",
        "order_id",
        db.raw("null as related_person_id")
      );

    const baseQuery = baseQueryExpenses
      .unionAll([baseQueryInvoices, baseQueryPaidInvoices], true)
      .as("transactions");

    const data = await baseQuery
      .clone()
      .orderBy(sortBy, order)
      .limit(limit)
      .offset((page - 1) * limit);

    const [{ total }] = await db
      .from(baseQuery.clone().as("t"))
      .count({ total: "*" });

    //todo filters, search

    return {
      data,
      total: parseInt(String(total), 10),
      page,
      limit,
    };
  },
};
