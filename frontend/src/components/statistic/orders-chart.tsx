import { ControlItem, DayRow, TotalsByStage } from "@/types/statistic.types";
import { Stage } from "@/types/order.types";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import InfoValue from "../shared/typography/info-value";
import OrdersChartControl from "./orders-chart-control";

interface OrdersChartProps {
  series: DayRow[];
  totalsByStage: TotalsByStage;
}
const OrdersChart = ({ series, totalsByStage }: OrdersChartProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [selectedStage, setSelectedStage] = useState<Record<Stage, boolean>>({
    new: true,
    modeling: false,
    milling: false,
    printing: false,
    delivery: false,
    done: false,
  });

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const stages: ControlItem[] = [
    {
      key: "new",
      label: t(`order.stages.new`),
      amount: totalsByStage.new,
      color: "text-action-plus",
    },
    {
      key: "modeling",
      label: t(`order.stages.modeling`),
      amount: totalsByStage.modeling,
      color: "text-accent-blue",
    },
    {
      key: "milling",
      label: t(`order.stages.milling`),
      amount: totalsByStage.milling,
      color: "text-text-regular",
    },
    {
      key: "printing",
      label: t(`order.stages.printing`),
      amount: totalsByStage.printing,
      color: "text-accent-violet",
    },
    {
      key: "delivery",
      label: t(`order.stages.delivery`),
      amount: totalsByStage.delivery,
      color: "text-accent-red",
    },
    {
      key: "done",
      label: t(`order.stages.done`),
      amount: totalsByStage.done,
      color: "text-brand-default",
    },
  ];

  const chartConfig = {
    new: {
      label: t("order.stages.new"),
      color: "var(--color-action-plus)",
    },
    modeling: {
      label: t("order.stages.modeling"),
      color: "var(--color-accent-blue)",
    },
    milling: {
      label: t("order.stages.milling"),
      color: "var(--color-text-regular)",
    },
    printing: {
      label: t("order.stages.printing"),
      color: "var(--color-accent-violet)",
    },
    delivery: {
      label: t("order.stages.delivery"),
      color: "var(--color-accent-red)",
    },
    done: {
      label: t("order.stages.done"),
      color: "var(--color-brand-default)",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col gap-5 w-full bg-ui-sidebar border border-ui-border rounded-sm p-5">
      <div className="flex items-center justify-between">
        <InfoValue className="text-base/tight font-bold text-brand-dark">
          {t("statistic.orders_dynamic")}
        </InfoValue>
        <InfoValue className="text-base/tight  text-text-muted">
          {dayjs(from).format("DD.MM.YYYY")}-{dayjs(to).format("DD.MM.YYYY")}
        </InfoValue>
      </div>
      <OrdersChartControl
        data={stages}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
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
          {(Object.keys(selectedStage) as Stage[])
            .filter((s) => selectedStage[s])
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
      {/* </div> */}
    </div>
  );
};

export default OrdersChart;
