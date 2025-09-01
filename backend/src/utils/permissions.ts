import { DashboardIndicators } from "../types/dashboard.types";
import { PersonRole } from "../types/person.types";

export function getDashboardVisibleFieldsForRole(role: PersonRole): string[] {
  return [
    "totalOrders",
    "totalModeling",
    "modellersCounts",
    "stagesStatusCount",
    "totalProblemOrders",
    "totalImportantOrders",
    "totalFavoriteOrders",
    "totalModelingPaymentsAmountByStatus",

    ...(role === "super_admin"
      ? [
          "totalMilling",
          "totalPrinting",
          "totalDelivery",
          "planedIncome",
          "actualIncome",
          "actualExpenses",
          "planedExpenses",
          "actualProfit",
          "planedProfit",
          "planedProfitability",
          "totalPaymentsAmountByStatus",
        ]
      : []),
  ];
}

export const DASHBOARD_ROLE_FIELDS: Record<
  PersonRole,
  readonly (keyof DashboardIndicators)[]
> = {
  super_admin: [
    "totalOrders",
    "totalModeling",
    "modellersCounts",
    "stagesStatusCount",
    "totalProblemOrders",
    "totalImportantOrders",
    "totalFavoriteOrders",
    "totalModelingPaymentsAmountByStatus",
    "totalMilling",
    "totalPrinting",
    "totalDelivery",
    "planedIncome",
    "actualIncome",
    "actualExpenses",
    "planedExpenses",
    "actualProfit",
    "planedProfit",
    "planedProfitability",
    "totalPaymentsAmountByStatus",
  ] as const,
  modeller: [
    "totalOrders",
    "totalModeling",
    "modellersCounts",
    "stagesStatusCount",
    "totalProblemOrders",
    "totalImportantOrders",
    "totalFavoriteOrders",
    "totalModelingPaymentsAmountByStatus",
  ] as const,
  miller: [] as const,
  client: [] as const,
  print: [] as const,
} satisfies Record<string, readonly (keyof DashboardIndicators)[]>;
