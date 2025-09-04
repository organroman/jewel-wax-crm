import { Statistic } from "../types/statistic";
import { OrderModel } from "../models/order-model";
import { StatisticModel } from "../models/statistic-model";
import { defineFromToDates } from "../utils/helpers";
import { buildFinanceStats, buildOrdersStats } from "../utils/statistic";

export const StatisticService = {
  async getStatistic({
    from,
    to,
    customer_id,
    performer_id,
  }: {
    from: string;
    to: string;
    customer_id?: number;
    performer_id: number;
  }): Promise<Statistic> {
    const { startFrom, finishTo } = defineFromToDates(from, to);
    const orders = await StatisticModel.getOrders({
      from: startFrom,

      to: finishTo,
      customer_id,
      performer_id,
    });

    const orderIds = orders.map((order) => order.id);

    const ordersStages = await OrderModel.getOrderStagesByOrderIds(orderIds);
    const invoices = await StatisticModel.getInvoicesPaidInPeriod(
      startFrom,
      finishTo,
      customer_id
    );
    const expenses = await StatisticModel.getExpensesPaidInPeriod(
      startFrom,
      finishTo,
      performer_id
    );

    const { series, totalsByStage } = buildOrdersStats(ordersStages);
    const { financeSeries, totals } = buildFinanceStats(
      orders,
      invoices,
      expenses
    );

    const totalOrders = orders.length;
    const totalOrdersAmount = orders.reduce(
      (acc, order) => acc + (Number(order.amount) || 0),
      0
    );

    const uniqCustomerIds: number[] = [];

    orders.forEach((order) => {
      if (uniqCustomerIds.includes(order.customer_id)) {
        return;
      } else uniqCustomerIds.push(order.customer_id);
    });

    const totalCustomers = uniqCustomerIds.length;

    const averageProcessingPeriod =
      orders.reduce((acc, order) => {
        const processingDays =
          order.processing_days ??
          Math.ceil(
            (Date.now() - new Date(order.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );
        const totalDuration = acc + processingDays;
        return totalDuration;
      }, 0) / totalOrders;

    return {
      totalOrders,
      totalOrdersAmount: Math.round(totalOrdersAmount),
      totalCustomers,
      averageProcessingPeriod: Math.round(averageProcessingPeriod),
      series,
      totalsByStage,
      financeSeries,
      financeTotals: totals,
    };
  },
};
