export interface Statistic {
  totalOrders: number;
  totalOrdersAmount: number;
  totalCustomers: number;
  averageProcessingPeriod: number;
}

export interface IndicatorData {
  label: string;
  amount?: number;
  icon: any;
  currencySign: boolean;
}
