import { StageStatus } from "./order.types";

export type ModellerCount = {
  fullname: string;
  count: number;
};

export type ActiveStageCount = {
  active_stage_status: StageStatus;
  count: number;
};

export type PaymentsByStatusCount = {
  unpaid: number;
  partly_paid: number;
  paid: number;
};

export interface DashboardIndicators {
  totalOrders: number;
  totalModeling: number;
  totalMilling: number;
  totalPrinting: number;
  totalDelivery: number;
  modellersCounts: ModellerCount[];
  stagesStatusCount: ActiveStageCount[];
  totalImportantOrders: number;
  totalFavoriteOrders: number;
  totalProblemOrders: number;
  planedIncome: number;
  actualIncome: number;
  actualExpenses: number;
  planedExpenses: number;
  actualProfit: number;
  planedProfit: number;
  planedProfitability: number;
  totalPaymentsAmountByStatus: PaymentsByStatusCount;
  totalModelingPaymentsAmountByStatus: PaymentsByStatusCount;
}
