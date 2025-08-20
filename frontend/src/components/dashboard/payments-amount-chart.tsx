import { PaymentsByStatusCount } from "@/types/dashboard.types";

import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Cell, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer } from "../ui/chart";
import InfoLabel from "../shared/typography/info-label";

interface PaymentsAmountChartProps {
  paymentsByStatus: PaymentsByStatusCount;
}

const PaymentsAmountChart = ({
  paymentsByStatus,
}: PaymentsAmountChartProps) => {
  const { t } = useTranslation();

  const chartData = [
    {
      status: "unpaid",
      count: paymentsByStatus.unpaid,
      fill: "var(--color-accent-red)",
    },
    {
      status: "partly_paid",
      count: paymentsByStatus.partly_paid,
      fill: "var(--color-action-plus)",
    },
    {
      status: "paid",
      count: paymentsByStatus.paid,
      fill: "var(--color-brand-default)",
    },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
        color="white"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-base leading-5">
            {t("dashboard.finance")}
          </p>
          <p className="text-base text-text-muted leading-4">
            {t("dashboard.order_payments")}
          </p>
        </div>
        <InfoLabel className="text-base leading-5">
          {dayjs(new Date()).format("DD.MM.YYYY")}
        </InfoLabel>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[370px] h-[280px]">
          <ChartContainer
            config={chartConfig}
            className="m-auto aspect-square max-h-[280px] self-center p-0"
          >
            <PieChart>
              {/* <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} /> */}
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={40}
                outerRadius={140}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-accent-red">{t("dashboard.unpaid")}:</p>
          <p className="font-semibold leading-5">
            {paymentsByStatus.unpaid.toFixed(2)}₴
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-action-plus">
            {t("dashboard.partly_paid")}:
          </p>
          <p className="font-semibold leading-5">
            {paymentsByStatus.partly_paid.toFixed(2)}₴
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-brand-default">{t("dashboard.paid")}:</p>
          <p className="font-semibold leading-5">
            {paymentsByStatus.paid.toFixed(2)}₴
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsAmountChart;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
