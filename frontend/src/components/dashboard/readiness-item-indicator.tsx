import InfoValue from "../shared/typography/info-value";
import { cn } from "@/lib/utils";

interface ReadinessItemIndicatorProps {
  label: string;
  value: number;
  labelColor: string;
}

const ReadinessItemIndicator = ({
  label,
  value,
  labelColor,
}: ReadinessItemIndicatorProps) => {
  return (
    <div className="flex flex-row gap-2.5 items-center">
      <p className={cn("text-sm leading-4", labelColor)}>{label}:</p>
      <InfoValue className="font-semibold text-base">{value}</InfoValue>
    </div>
  );
};

export default ReadinessItemIndicator;
