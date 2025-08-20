import { useTranslation } from "react-i18next";
import { Label, Pie, PieChart } from "recharts";

import ActualPlanItemIndicator from "./actual-plan-item-indicator";
import { ChartConfig, ChartContainer } from "../ui/chart";

interface ActualPlanIndicatorsProps {
  planedIncome: number;
  actualIncome: number;
  actualExpenses: number;
  planedExpenses: number;
  actualProfit: number;
  planedProfit: number;
  planedProfitability: number;
}

const ActualPlanIndicators = ({
  planedExpenses,
  actualExpenses,
  planedIncome,
  actualIncome,
  planedProfit,
  actualProfit,
  planedProfitability,
}: ActualPlanIndicatorsProps) => {
  const { t } = useTranslation();

  const chartData = [
    {
      status: "other",
      count: 100 - planedProfitability,
      fill: "var(--color-ui-border)",
    },
    {
      status: "profitability",
      count: planedProfitability,
      fill: "var(--color-brand-default)",
    },
  ];
  return (
    <div className="w-full grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-5">
      <ActualPlanItemIndicator
        actualColor="text-action-plus"
        actualLabel={t("dashboard.actual_income")}
        planedLabel={t("dashboard.planed_income")}
        actualValue={actualIncome}
        planedValue={planedIncome}
      />
      <ActualPlanItemIndicator
        actualColor="text-action-alert"
        actualLabel={t("dashboard.actual_expenses")}
        planedLabel={t("dashboard.planed_expenses")}
        actualValue={actualExpenses}
        planedValue={planedExpenses}
      />
      <ActualPlanItemIndicator
        actualColor="text-brand-default"
        actualLabel={t("dashboard.actual_profit")}
        planedLabel={t("dashboard.planed_profit")}
        actualValue={actualProfit}
        planedValue={planedProfit}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-[200px]">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {`${planedProfitability.toFixed(1)}%`}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 12}
                            className="fill-muted-foreground whitespace-pre-wrap"
                          >
                            {t("dashboard.planed")}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 26}
                            className="fill-muted-foreground whitespace-pre-wrap"
                          >
                            {t("dashboard.profitability")}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default ActualPlanIndicators;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
