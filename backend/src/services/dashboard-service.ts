import { PersonRole } from "../types/person.types";
import { DashboardIndicators } from "../types/dashboard.types";
import { StageStatus } from "../types/order.types";

import { DashboardModel } from "../models/dashboard-model";
import { FinanceModel } from "../models/finance-model";

import { groupBy } from "../utils/helpers";
import { DASHBOARD_ROLE_FIELDS } from "../utils/permissions";

export const DashboardService = {
  async getDashboardData({
    user_id,
    user_role,
  }: {
    user_id: number;
    user_role: PersonRole;
  }): Promise<DashboardIndicators> {
    const orders = await DashboardModel.getOrders({ user_id, user_role });

    const stageModeling = orders.filter((o) => o.active_stage === "modeling");
    const stageMilling = orders.filter((o) => o.active_stage === "milling");
    const stagePrinting = orders.filter((o) => o.active_stage === "printing");
    const stageDelivery = orders.filter((o) => o.active_stage === "delivery");
    const importantOrders = orders.filter((o) => o.is_important);
    const favoriteOrders = orders.filter((o) => o.is_favorite);

    const ordersInNegotiation = orders.filter(
      (o) =>
        o.active_stage_status === "clarification" ||
        o.active_stage_status === "negotiation"
    );
    const problemOrders = ordersInNegotiation.filter((item) => {
      if (!item?.active_stage_status_started_at) return false;

      const startedAt = new Date(item.active_stage_status_started_at);
      const diffInDays =
        (Date.now() - startedAt.getTime()) / (1000 * 60 * 60 * 24);

      return diffInDays > 5;
    });

    const initial = {
      done: 0,
      pending: 0,
      processed: 0,
      in_process: 0,
      negotiation: 0,
      clarification: 0,
    } satisfies Record<StageStatus, number>;

    const totals = orders.reduce<Record<StageStatus, number>>(
      (acc, item) => {
        if (item.active_stage_status) {
          acc[item.active_stage_status] =
            (acc[item.active_stage_status] || 0) + 1;
        }
        return acc;
      },
      { ...initial }
    );
    const stagesStatusCount = (
      Object.entries(totals) as [StageStatus, number][]
    ).map(([active_stage_status, count]) => ({ active_stage_status, count }));

    const modellersCounts = Object.entries(
      stageModeling.reduce<Record<string, number>>((acc, item) => {
        if (item.modeller_id) {
          const fullName =
            item.modeller_last_name + " " + item.modeller_first_name;
          acc[fullName] = (acc[fullName] || 0) + 1;
        }
        return acc;
      }, {})
    ).map(([fullname, count]) => ({ fullname, count }));

    const orderIds = orders.map((o) => o.id);

    const allExpenses = await FinanceModel.getExpensesByOrderIds(orderIds);
    const allInvoices = await FinanceModel.getInvoicesByOrderIds(orderIds);

    const planedIncome = orders.reduce((acc, item) => {
      return acc + Number(item.amount || 0);
    }, 0);

    const actualIncome = allInvoices.reduce((acc, item) => {
      return acc + Number(item.amount_paid || 0);
    }, 0);

    const actualExpenses = allExpenses.reduce((acc, item) => {
      return acc + Number(item.amount || 0);
    }, 0);

    const planedExpenses = orders.reduce((acc, item) => {
      return (
        acc + Number(item.modeling_cost || 0) + Number(item.printing_cost || 0)
      );
    }, 0);

    const actualProfit = actualIncome - actualExpenses;
    const planedProfit = planedIncome - planedExpenses;
    const planedProfitability =
      ((planedIncome - planedExpenses) / planedIncome) * 100;

    const invoicesByOrderId = groupBy(allInvoices, "order_id");
    const ordersPayments = orders.map((o) => {
      const invoices = invoicesByOrderId[o.id] ?? [];

      const totalPaid = invoices.reduce((acc, item) => {
        return acc + Number(item.amount_paid || 0);
      }, 0);

      const paidClamped = Math.min(totalPaid, o.amount);

      let unpaid = 0;
      let partly_paid = 0;
      let paid = 0;

      if (paidClamped <= 0) {
        unpaid = o.amount;
      } else if (paidClamped >= o.amount) {
        paid = o.amount;
      } else {
        partly_paid = totalPaid;
      }

      return {
        id: o.id,
        unpaid,
        partly_paid,
        paid,
      };
    });

    const totalPaymentsAmountByStatus = ordersPayments.reduce(
      (acc, o) => {
        acc.unpaid += Number(o.unpaid);
        acc.partly_paid += Number(o.partly_paid);
        acc.paid += Number(o.paid);
        return acc;
      },
      { unpaid: 0, partly_paid: 0, paid: 0 }
    );

    const modelingExpenses = allExpenses.filter(
      (e) => e.category === "modelling"
    );

    const modelingExpensesByOrder = groupBy(modelingExpenses, "order_id");
    const modelingPayments = orders.map((o) => {
      const expenses = modelingExpensesByOrder[o.id] ?? [];

      const totalPaid = expenses.reduce((acc, item) => {
        return acc + Number(item.amount || 0);
      }, 0);

      let unpaid = 0;
      let partly_paid = 0;
      let paid = 0;

      if (o.modeling_cost) {
        const paidClamped = Math.min(totalPaid, o.modeling_cost);

        if (paidClamped <= 0) {
          unpaid = o.modeling_cost;
        } else if (paidClamped >= o.modeling_cost) {
          paid = o.modeling_cost;
        } else {
          partly_paid = paidClamped;
        }
      }

      return {
        id: o.id,
        unpaid,
        partly_paid,
        paid,
      };
    });

    const totalModelingPaymentsAmountByStatus = modelingPayments.reduce(
      (acc, o) => {
        acc.unpaid += Number(o.unpaid);
        acc.partly_paid += Number(o.partly_paid);
        acc.paid += Number(o.paid);
        return acc;
      },
      { unpaid: 0, partly_paid: 0, paid: 0 }
    );

    const dashboardData = {
      totalOrders: orders.length,
      totalModeling: stageModeling.length,
      totalMilling: stageMilling.length,
      totalPrinting: stagePrinting.length,
      totalDelivery: stageDelivery.length,
      modellersCounts,
      stagesStatusCount,
      totalProblemOrders: problemOrders.length,
      totalImportantOrders: importantOrders.length,
      totalFavoriteOrders: favoriteOrders.length,
      planedIncome,
      actualIncome,
      actualExpenses,
      planedExpenses,
      actualProfit,
      planedProfit,
      planedProfitability,
      totalPaymentsAmountByStatus,
      totalModelingPaymentsAmountByStatus,
    };
    const fields = DASHBOARD_ROLE_FIELDS[user_role] ?? [];
    const filtered = pick(dashboardData, fields);

    return filtered;
  },
};

function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  return Object.fromEntries(
    (keys as readonly string[]).map((k) => [k, obj[k as keyof T]])
  ) as Pick<T, K[number]>;
}
