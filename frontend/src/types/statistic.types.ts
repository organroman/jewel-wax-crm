import { Stage } from "./order.types";

export type DayRow = {
  date: string;
  new: number;
  modeling: number;
  milling: number;
  printing: number;
  delivery: number;
  done: number;
};
export type TotalsByStage = {
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
export type TotalsFinance = {
  plannedIncome: number;
  actualIncome: number;
  plannedExpenses: number;
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

export interface IndicatorData {
  label: string;
  amount?: number;
  icon: any;
  currencySign: boolean;
}

export type FinanceIndicator =
  | "actualIncome"
  | "planedIncome"
  | "actualExpenses"
  | "planedExpenses";

export interface ControlItem<K extends string = string> {
  key: K;
  amount: number;
  color: string;
  label: string;
}

export type Dict<K extends string> = Record<K, boolean>;
