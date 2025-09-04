import { ChartItem, DayRow, FinanceRow } from "../types/statistic";
import { OrderBase, OrderStage, Stage } from "../types/order.types";
import { Expense, Invoice } from "../types/finance.type";
import { ORDER_STAGE } from "../constants/enums";

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(d)); // en-CA => YY

const KYIV_TZ = "Europe/Kyiv";
const dateKey = (d: Date | string, tz = KYIV_TZ) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(d));

export function buildOrdersStats(orderStages: OrderStage[]) {
  // 1) Per-stage -> per-date counters (Map for perf)
  const byStage: Record<Stage, Record<string, number>> = {
    new: {},
    modeling: {},
    milling: {},
    printing: {},
    delivery: {},
    done: {},
  };

  for (const st of orderStages) {
    const stamp = st.stage === "new" ? st.started_at : st.completed_at;
    if (!stamp) continue;
    const key = dateKey(stamp);
    const bucket = byStage[st.stage];
    bucket[key] = (bucket[key] ?? 0) + 1;
  }
  const STAGES = [...ORDER_STAGE];
  // 2) Master set of all dates we actually have
  const dateSet = new Set<string>();
  STAGES.forEach((s) => Object.keys(byStage[s]).forEach((k) => dateSet.add(k)));

  const dates = Array.from(dateSet).sort();

  // 3) Build merged series rows (Recharts-ready)
  const series: DayRow[] = dates.map((date) => ({
    date,
    new: byStage.new[date] ?? 0,
    modeling: byStage.modeling[date] ?? 0,
    milling: byStage.milling[date] ?? 0,
    printing: byStage.printing[date] ?? 0,
    delivery: byStage.delivery[date] ?? 0,
    done: byStage.done[date] ?? 0,
  }));

  // 4) Per-stage arrays (if you still want the old shape)
  const toChartItem = (s: Stage): ChartItem => {
    const data = Object.entries(byStage[s])
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    const total = data.reduce((acc, i) => acc + (i.quantity || 0), 0);
    return { total, data };
  };

  const newStages: ChartItem = toChartItem("new");
  const modelingStages: ChartItem = toChartItem("modeling");
  const millingStages: ChartItem = toChartItem("milling");
  const printingStages: ChartItem = toChartItem("printing");
  const deliveryStages: ChartItem = toChartItem("delivery");
  const doneStages: ChartItem = toChartItem("done");

  // 6) Also handy: totals by stage (for badges)
  const totalsByStage = {
    new: newStages.total,
    modeling: modelingStages.total,
    milling: millingStages.total,
    printing: printingStages.total,
    delivery: deliveryStages.total,
    done: doneStages.total,
  };

  return {
    // merged series for chart (best for Recharts)
    series, // DayRow[]

    // quick totals map
    totalsByStage,
  };
}

const bump = (map: Record<string, number>, key: string, add: number) => {
  if (!key) return;
  map[key] = (map[key] ?? 0) + add;
};

export function buildFinanceStats(
  orders: OrderBase[],
  invoices: Invoice[],
  expenses: Expense[]
) {
  // 1) Per-stage -> per-date counters (Map for perf)
  const plannedIncome: Record<string, number> = {};
  const actualIncome: Record<string, number> = {};
  const plannedExpenses: Record<string, number> = {};
  const actualExpenses: Record<string, number> = {};

  for (const o of orders) {
    const k = fmt(o.created_at);
    bump(plannedIncome, k, Number(o.amount));
    const costSum =
      Number(o.modeling_cost) +
      Number(o.printing_cost) +
      Number(o.milling_cost);
    bump(plannedExpenses, k, costSum);
  }

  for (const inv of invoices) {
    if (!inv.paid_at) continue;
    const k = fmt(inv.paid_at);
    bump(actualIncome, k, Number(inv.amount_paid));
  }

  // actual expenses by expense.created_at
  for (const ex of expenses) {
    const k = fmt(ex.created_at);
    bump(actualExpenses, k, Number(ex.amount));
  }

  const dateSet = new Set<string>([
    ...Object.keys(plannedIncome),
    ...Object.keys(plannedExpenses),
    ...Object.keys(actualIncome),
    ...Object.keys(actualExpenses),
  ]);

  const dates = Array.from(dateSet).sort();
  const financeSeries: FinanceRow[] = dates.map((d) => ({
    date: d,
    plannedIncome: plannedIncome[d] ?? 0,
    actualIncome: actualIncome[d] ?? 0,
    plannedExpenses: plannedExpenses[d] ?? 0,
    actualExpenses: actualExpenses[d] ?? 0,
  }));

  const toLine = (map: Record<string, number>) => {
    const data = Object.entries(map)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    const total = data.reduce((acc, x) => acc + Number(x.amount), 0);
    return { total, data };
  };

  const lines = {
    plannedIncome: toLine(plannedIncome),
    actualIncome: toLine(actualIncome),
    plannedExpenses: toLine(plannedExpenses),
    actualExpenses: toLine(actualExpenses),
  };

  const totals = {
    planedIncome: parseFloat(lines.plannedIncome.total.toFixed(2)),
    actualIncome: parseFloat(lines.actualIncome.total.toFixed(2)),
    planedExpenses: parseFloat(lines.plannedExpenses.total.toFixed(2)),
    actualExpenses: parseFloat(lines.actualExpenses.total.toFixed(2)),
  };

  return { financeSeries, totals };
}
