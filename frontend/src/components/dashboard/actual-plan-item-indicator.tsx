import { Progress } from "../ui/progress";

import InfoLabel from "../shared/typography/info-label";

import { cn } from "@/lib/utils";

interface ActualPlanItemIndicatorProps {
  actualLabel: string;
  actualValue: number;
  planedLabel: string;
  planedValue: number;
  actualColor: string;
}

const ActualPlanItemIndicator = ({
  actualLabel,
  actualColor,
  actualValue,
  planedLabel,
  planedValue,
}: ActualPlanItemIndicatorProps) => {
  const progress = ((actualValue / planedValue) * 100).toFixed(2);
  const bgColor = actualColor.replace("text", "bg");
  return (
    <div className="flex flex-col justify-center px-5 gap-4 border border-ui-border bg-ui-sidebar rounded-sm">
      <div className="flex flex-row items-center justify-between">
        <InfoLabel className="text-sm">{actualLabel}:</InfoLabel>
        <span className={cn("font-semibold text-xl", actualColor)}>
          {actualValue.toFixed(2)}₴
        </span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <InfoLabel className="text-sm">{planedLabel}:</InfoLabel>
        <span className="font-semibold text-xl text-brand-dark">
          {planedValue.toFixed(2)}₴
        </span>
      </div>
      <Progress
        value={Number(progress)}
        indicatorColor={bgColor}
        className={cn("w-full h-4 mt-2.5")}
      />
    </div>
  );
};

export default ActualPlanItemIndicator;
