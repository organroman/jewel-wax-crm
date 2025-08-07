import { PaginatedResult } from "../types/shared.types";
import { ModelingReportOrder } from "../types/report.types";
import { OrderBase } from "../types/order.types";
import db from "../db/db";
import { paginateQuery } from "../utils/pagination";
import { Expense } from "../types/finance.type";
import { Person, PersonRole } from "../types/person.types";

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
};
