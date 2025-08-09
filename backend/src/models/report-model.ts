import { PaginatedResult } from "../types/shared.types";
import {
  FinanceReportDataType,
  FinanceReportOrder,
  GetAllReportOptions,
  ModelingReportOrder,
} from "../types/report.types";
import { OrderBase } from "../types/order.types";
import { Expense } from "../types/finance.type";
import { PersonRole } from "../types/person.types";

import db from "../db/db";

import { FinanceModel } from "./finance-model";
import { OrderModel } from "./order-model";

import { paginateQuery } from "../utils/pagination";
import { groupBy } from "../utils/helpers";

export const ReportModel = {
  async getClientsIndicators({ from, to }: { from: Date; to: Date }): Promise<{
    total_active: number;
    total_new_clients: number;
    total_debtors: number;
  }> {
    const [{ total_active, total_new_clients }] = await db("persons")
      .where("role", "client")
      .select(
        db.raw(`COUNT(*) FILTER (WHERE is_active = true) as total_active`),
        db.raw(
          `COUNT(*) FILTER (WHERE created_at BETWEEN ? AND ?) as total_new_clients`,
          [from, to]
        )
      );
    const totalDebtArr = await db<OrderBase>("orders")
      .whereIn("payment_status", ["unpaid", "partly_paid"])
      .andWhereBetween("created_at", [from, to])
      .groupBy("customer_id")
      .count("* as total");

    return {
      total_active,
      total_new_clients,
      total_debtors: totalDebtArr.length,
    };
  },
  async getOrdersWithModeling({
    page = 1,
    limit = 10,
    user_role,
    user_id,
    from,
    to,
    person_id,
  }: {
    page?: number;
    limit?: number;
    user_role: PersonRole;
    user_id: number;
    person_id?: number;
    from: Date;
    to: Date;
  }): Promise<PaginatedResult<ModelingReportOrder>> {
    const baseQuery = db<OrderBase>("orders")
      .whereNotNull(`modeller_id`)
      .andWhereBetween("orders.created_at", [from, to])
      .modify((qb) => {
        const joins = ["modeller"];
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
        qb.select(
          "orders.id",
          "orders.number",
          "orders.active_stage",
          "orders.created_at",
          "orders.modeller_id",
          "orders.modeling_cost"
        );
      });

    if (user_role === "modeller") {
      baseQuery.where("modeller_id", user_id);
    }

    if (person_id) {
      baseQuery.where("modeller_id", person_id);
    }

    return paginateQuery(baseQuery, { page, limit });
  },
  async getModelingIndicators({
    from,
    to,
    isAdmin,
    user_id,
  }: {
    from: Date;
    to: Date;
    isAdmin: boolean;
    user_id: number;
  }): Promise<{
    totalOrders: number;
    totalModelingCost: number;
    sumOfExpenses: number;
    debt: number;
  }> {
    const baseOrdersQuery = db<ModelingReportOrder>("orders").whereBetween(
      "created_at",
      [from, to]
    );

    if (!isAdmin) {
      baseOrdersQuery.andWhere("modeller_id", user_id);
    }
    const orders = await baseOrdersQuery.select("id", "modeling_cost");

    const totalModelingCost = orders.reduce(
      (sum, o) => sum + Number(o.modeling_cost || 0),
      0
    );

    const orderIds = orders.map((o) => o.id);

    let sumOfExpenses = 0;

    if (orderIds.length > 0) {
      const [row] = await db<Expense>("expenses")
        .whereIn("order_id", orderIds)
        .andWhere("category", "=", "modelling")
        .sum<{ totalExpenses: string }[]>("amount as totalExpenses");

      sumOfExpenses = Number(row?.totalExpenses) || 0;
    }

    const debt = totalModelingCost - sumOfExpenses;

    return {
      totalOrders: orders.length,
      totalModelingCost,
      sumOfExpenses,
      debt,
    };
  },
  async getAllExpenses({
    page,
    limit,
    filters,
    sortBy = "created_at",
    order = "desc",
  }: GetAllReportOptions): Promise<PaginatedResult<Expense>> {
    const baseQuery = db<Expense>("expenses").select("*");

    if (filters?.from && filters.to) {
      baseQuery.whereBetween("created_at", [filters.from, filters.to]);
    }

    if (filters?.expense_category) {
      baseQuery.where("category", filters.expense_category);
    }
    return await paginateQuery<Expense>(baseQuery, {
      page,
      limit,
      sortBy,
      order,
    });
  },
  async getOrdersBase({
    page = 1,
    limit = 10,
    from,
    to,
  }: {
    page?: number;
    limit?: number;
    from: Date;
    to: Date;
  }): Promise<PaginatedResult<FinanceReportOrder>> {
    const baseQuery = db<OrderBase>("orders")
      .andWhereBetween("orders.created_at", [from, to])
      .modify((qb) => {
        const joins = ["customer"];
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
        qb.select(
          "orders.id",
          "orders.number",
          "orders.created_at",
          "orders.amount",
          "orders.modeling_cost",
          "orders.printing_cost",
          "orders.customer_id"
        );
      });

    return paginateQuery(baseQuery, { page, limit });
  },

  async getFinanceReportIndicators({
    from,
    to,
    dataType,
  }: {
    from: Date;
    to: Date;
    dataType?: FinanceReportDataType;
  }): Promise<{
    total_actual_income: number;
    total_debt: number | null;
    total_expenses: number;
    total_profit: number;
    total_profitability: number;
  }> {
    const baseOrdersQuery = db<OrderBase>("orders").whereBetween("created_at", [
      from,
      to,
    ]);

    const orders =
      (await baseOrdersQuery.select(
        "id",
        "amount",
        "modeling_cost",
        "printing_cost",
        "milling_cost"
      )) || [];
    const orderIds = orders.map((o) => o.id);

    const totalOrdersAmount = orders.reduce(
      (sum, o) => sum + Number(o.amount || 0),
      0
    );

    const allOrdersInvoices = await FinanceModel.getInvoicesByOrderIds(
      orderIds
    );

    const allOrdersExpenses = await FinanceModel.getExpensesByOrderIds(
      orderIds
    );

    const allInvoicesPaidInPeriod = await FinanceModel.getInvoicesPaidInPeriod(
      from,
      to
    );

    const allOrdersDeliveries = await OrderModel.getOrderDeliveriesByOrderIds(
      orderIds
    );

    const totalAmountPaidInPeriod = allInvoicesPaidInPeriod.reduce(
      (sum, invoice) => sum + Number(invoice.amount_paid || 0),
      0
    );

    const deliveriesByOrderId = groupBy(allOrdersDeliveries, "order_id") ?? [];

    const totalOrdersExpenses = orders.reduce((sum, order) => {
      const milling = Number(order.milling_cost ?? 0);
      const modeling = Number(order.modeling_cost ?? 0);
      const printing = Number(order.printing_cost ?? 0);

      const deliveries =
        deliveriesByOrderId[order.id]?.reduce(
          (delSum, d) => delSum + Number(d.cost ?? 0),
          0
        ) ?? 0;
      return sum + milling + modeling + printing + deliveries;
    }, 0);

    const performersExpensesPaid = allOrdersExpenses
      .filter((exp) => exp.category !== "other" && exp.category !== "materials")
      ?.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    const unpaidOrdersExpenses = totalOrdersExpenses - performersExpensesPaid;

    const actualExpenses = allOrdersExpenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );

    const totalPaid = allOrdersInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount_paid || 0),
      0
    );

    let totalIncome = totalAmountPaidInPeriod + (totalOrdersAmount - totalPaid);
    let totalDebt: number | null = totalOrdersAmount - totalPaid;
    let totalExpenses = actualExpenses + unpaidOrdersExpenses;
    let totalProfit = totalIncome - totalExpenses;
    let totalProfitability = (totalProfit / totalIncome) * 100;

    if (dataType === "actual") {
      totalIncome = totalPaid;
      totalExpenses = actualExpenses;
      totalProfit = totalIncome - totalExpenses;
      totalProfitability = (totalProfit / totalIncome) * 100;
    } else if (dataType === "planed") {
      totalIncome = totalOrdersAmount - totalPaid;
      totalDebt = null;
      totalExpenses = unpaidOrdersExpenses;
      totalProfit = totalIncome - totalExpenses;
      totalProfitability = (totalProfit / totalIncome) * 100;
    }

    return {
      total_actual_income: totalIncome,
      total_debt: totalDebt,
      total_expenses: totalExpenses,
      total_profit: totalProfit,
      total_profitability: totalProfitability,
    };
  },
};
