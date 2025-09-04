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
