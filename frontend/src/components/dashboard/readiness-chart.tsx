import { Cell, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

interface ReadinessChatProps {
  clarification: number;
  negotiation: number;
  inProcess: number;
  processed: number;
}
const ReadinessChart = ({
  clarification,
  negotiation,
  inProcess,
  processed,
}: ReadinessChatProps) => {
  const chartData = [
    {
      status: "clarification",
      count: clarification,
      fill: "var(--color-action-plus)",
    },
    {
      status: "negotiation",
      count: negotiation,
      fill: "var(--color-accent-red)",
    },
    {
      status: "inProcess",
      count: inProcess,
      fill: "var(--color-accent-blue)",
    },
    {
      status: "processed",
      count: processed,
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
    <div className="w-[158px] h-[158px]">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[160px] p-0"
      >
        <PieChart>
          {/* <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} /> */}
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={20}
            outerRadius={65}
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
  );
};

export default ReadinessChart;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
