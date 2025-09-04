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
export interface Statistic {
  totalOrders: number;
  totalOrdersAmount: number;
  totalCustomers: number;
  averageProcessingPeriod: number;
  series: DayRow[];
  totalsByStage: TotalsByStage;
}

export interface IndicatorData {
  label: string;
  amount?: number;
  icon: any;
  currencySign: boolean;
}

export interface ControlItem {
  key: Stage;
  amount: number;
  color: string;
  label: string;
}
