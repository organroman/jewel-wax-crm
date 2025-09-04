import { Expense, Invoice } from "../types/finance.type";
import db from "../db/db";
import { OrderBase } from "../types/order.types";

export const StatisticModel = {
  async getOrders({
    from,
    to,
    customer_id,
    performer_id,
  }: {
    from: Date;
    to: Date;
    customer_id?: number;
    performer_id?: number;
  }): Promise<OrderBase[]> {
    const baseQuery = db<OrderBase>("orders").whereBetween("created_at", [
      from,
      to,
    ]);

    if (customer_id) {
      baseQuery.where("customer_id", customer_id);
    }

    if (performer_id) {
      baseQuery.where((qb) => {
        qb.where("modeller_id", performer_id)
          .orWhere("miller_id", performer_id)
          .orWhere("printer_id", performer_id);
      });
    }

    const orders = await baseQuery.select("*");

    return orders;
  },

  async getInvoicesPaidInPeriod(
    from: Date,
    to: Date,
    customer_id?: number
  ): Promise<Invoice[]> {
    let baseQuery = db<Invoice>("invoices as i").whereBetween("paid_at", [
      from,
      to,
    ]);

    if (customer_id) {
      baseQuery = baseQuery
        .innerJoin("orders as o", "o.id", "i.order_id")
        .andWhere("o.customer_id", customer_id);
    }
    return await baseQuery.select("i.*");
  },

  async getExpensesPaidInPeriod(
    from: Date,
    to: Date,
    performer_id?: number
  ): Promise<Expense[]> {
    let baseQuery = db<Expense>("expenses").whereBetween("created_at", [
      from,
      to,
    ]);

    if (performer_id) {
      baseQuery.modify((qb) => qb.where("related_person_id", performer_id));
    }
    return await baseQuery.select("*");
  },
};
