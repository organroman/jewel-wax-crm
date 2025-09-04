import { IndicatorData } from "@/types/statistic.types";

interface IndicatorsItemProps {
  indicator: IndicatorData;
}
const IndicatorItem = ({ indicator }: IndicatorsItemProps) => {
  const Icon = indicator.icon;
  const amount = indicator.currencySign
    ? `${indicator.amount}₴`
    : indicator.amount;
  return (
    <div className="flex flex-row border border-ui-border rounded-sm bg-ui-sidebar p-5 flex-1 items-center justify-between">
      <div className="flex gap-2.5">
        <Icon className="text-brand-dark shrink-0" />
        <span className="text-base/4.5 font-semibold text-brand-dark inline-block max-w-[145px]">
          {indicator.label}
        </span>
      </div>
      <span className="text-brand-default font-bold text-2xl/normal">
        {amount}
      </span>
    </div>
  );
};

export default IndicatorItem;
