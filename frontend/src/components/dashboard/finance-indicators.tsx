import { PaymentsByStatusCount } from "@/types/dashboard.types";

import PaymentsAmountChart from "./payments-amount-chart";
import ActualPlanIndicators from "./actual-plan-indicators";

interface FinanceIndicatorsProps {
  totalPaymentsAmountByStatus: PaymentsByStatusCount;
  planedIncome: number;
  actualIncome: number;
  actualExpenses: number;
  planedExpenses: number;
  actualProfit: number;
  planedProfit: number;
  planedProfitability: number;
}

const FinanceIndicators = ({
  totalPaymentsAmountByStatus,
  planedExpenses,
  planedIncome,
  planedProfit,
  planedProfitability,
  actualExpenses,
  actualIncome,
  actualProfit,
}: FinanceIndicatorsProps) => {
  return (
    <div className="flex flex-1 p-7 gap-6 border border-ui-border bg-ui-sidebar rounded-sm">
      <PaymentsAmountChart paymentsByStatus={totalPaymentsAmountByStatus} />
      <ActualPlanIndicators
        planedExpenses={planedExpenses}
        planedIncome={planedIncome}
        planedProfit={planedProfit}
        planedProfitability={planedProfitability}
        actualExpenses={actualExpenses}
        actualIncome={actualIncome}
        actualProfit={actualProfit}
      />
    </div>
  );
};

export default FinanceIndicators;
