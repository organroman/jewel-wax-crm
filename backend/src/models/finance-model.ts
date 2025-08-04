import { OrderBase } from "../types/order.types";
import {
  Expense,
  ExpenseInput,
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

  async createExpense(data: ExpenseInput): Promise<Expense> {
    const [expense] = await db<Expense>("expenses").insert(data).returning("*");
    return expense;
  },

  async getExpensesByOrder(orderId: number): Promise<Expense[]> {
    const expenses = await db<Expense>("expenses")
      .where("order_id", orderId)
      .select("*");
    return expenses;
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
};
