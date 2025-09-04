import {
  ControlItem,
  FinanceIndicator,
  FinanceRow,
  TotalsFinance,
} from "@/types/statistic.types";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import InfoValue from "../shared/typography/info-value";
import OrdersChartControl from "./orders-chart-control";

interface FinanceChartProps {
  series: FinanceRow[];
  totals: TotalsFinance;
}

const FinanceChart = ({ series, totals }: FinanceChartProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [selectedFinance, setSelectedFinance] = useState<
    Record<FinanceIndicator, boolean>
  >({
    actualIncome: true,
    planedIncome: false,
    actualExpenses: true,
    planedExpenses: false,
  });

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const dataIndicators: ControlItem[] = [
    {
      key: "actualIncome",
      label: t(`statistic.actual_income`),
      amount: totals.actualIncome,
      color: "text-action-plus",
    },
    {
      key: "planedIncome",
      label: t(`statistic.planed_income`),
      amount: totals.plannedIncome,
      color: "text-brand-default",
    },
    {
      key: "actualExpenses",
      label: t(`statistic.actual_expenses`),
      amount: totals.actualExpenses,
      color: "text-action-minus",
    },
    {
      key: "planedExpenses",
      label: t(`statistic.planed_expenses`),
      amount: totals.plannedExpenses,
      color: "text-accent-violet",
    },
  ];

  const chartConfig = {
    actualIncome: {
      label: t(`statistic.actual_income`),
      color: "var(--color-action-plus)",
    },
    planedIncome: {
      label: t("statistic.planned_income"),
      color: "var(--color-brand-default)",
    },
    actualExpenses: {
      label: t("statistic.actual_expenses"),
      color: "var(--color-action-minus)",
    },
    planedExpenses: {
      label: t("statistic.planned_expenses"),
      color: "var(--color-accent-violet)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-5 w-full bg-ui-sidebar border border-ui-border rounded-sm p-5">
      <div className="flex items-center justify-between">
        <InfoValue className="text-base/tight font-bold text-brand-dark">
          {t("statistic.finance_dynamic")}
        </InfoValue>
        <InfoValue className="text-base/tight  text-text-muted">
          {dayjs(from).format("DD.MM.YYYY")}-{dayjs(to).format("DD.MM.YYYY")}
        </InfoValue>
      </div>
      <OrdersChartControl
        data={dataIndicators}
        selectedItem={selectedFinance}
        setSelectedItem={setSelectedFinance}
      />
      <ChartContainer config={chartConfig} className="max-h-[360px] w-full">
        <LineChart
          accessibilityLayer
          data={series}
          margin={{
            left: 12,
            right: 12,
            top: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => dayjs(value).format("DD.MM")}
            padding={{ left: 16, right: 16 }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {(Object.keys(selectedFinance) as FinanceIndicator[])
            .filter((s) => selectedFinance[s])
            .map((s) => (
              <Line
                key={s}
                dataKey={s}
                type="monotone"
                stroke={`var(--color-${s})`}
                strokeWidth={2}
                dot={{ r: 2, stroke: `var(--color-${s})` }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default FinanceChart;
