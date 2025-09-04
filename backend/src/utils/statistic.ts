import { ChartItem, DayRow } from "../types/statistic";
import { ORDER_STAGE } from "../constants/enums";
import { OrderStage, Stage } from "../types/order.types";

type AnyObj = Record<string, any>;

export function countByDate(
  items: AnyObj[],
  dateField: string = "created_at",
  timeZone: string = "Europe/Kyiv"
): { date: string; quantity: number }[] {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // en-CA => YYYY-MM-DD

  const counts = new Map<string, number>();

  for (const it of items) {
    const raw = it?.[dateField];
    if (!raw) continue;

    const d = new Date(raw); // supports Date or ISO string
    if (isNaN(d.getTime())) continue;

    const key = fmt.format(d); // e.g., "2025-06-21" in Europe/Kyiv
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([date, quantity]) => ({ date, quantity }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

const KYIV_TZ = "Europe/Kyiv";
const dateKey = (d: Date | string, tz = KYIV_TZ) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(d));

export function buildOrdersStats(orderStages: OrderStage[]) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // en-CA => YY

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
