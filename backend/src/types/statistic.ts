type ChartDataItem = {
  date: string;
  quantity: number;
};

export interface ChartItem {
  total: number;
  data: ChartDataItem[];
}
export type DayRow = {
  date: string;
  new: number;
  modeling: number;
  milling: number;
  printing: number;
  delivery: number;
  done: number;
};

export type FinanceRow = {
  date: string;
  plannedIncome: number;
  actualIncome: number;
  plannedExpenses: number;
  actualExpenses: number;
};
export type TotalsByStage = {
  new: number;
  modeling: number;
  milling: number;
  printing: number;
  delivery: number;
  done: number;
};

export type TotalsFinance = {
  planedIncome: number;
  actualIncome: number;
  planedExpenses: number;
  actualExpenses: number;
};

export interface Statistic {
  totalOrders: number;
  totalOrdersAmount: number;
  totalCustomers: number;
  averageProcessingPeriod: number;
  series: DayRow[];
  totalsByStage: TotalsByStage;
  financeSeries: FinanceRow[];
  financeTotals: TotalsFinance;
}
