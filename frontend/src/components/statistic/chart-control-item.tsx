import { Stage } from "@/types/order.types";
import { Switch } from "../ui/switch";
import InfoValue from "../shared/typography/info-value";
import { cn } from "@/lib/utils";

interface ChartControlItemProps {
  item: { key: Stage; amount: number; color: string; label: string };
  selectedStage: Record<Stage, boolean>;
  handleSwitch: (key: Stage) => void;
}

const ChartControlItem = ({
  item,
  selectedStage,
  handleSwitch,
}: ChartControlItemProps) => {
  return (
    <div className="flex items-center gap-2.5" key={item.key}>
      <Switch
        checked={selectedStage[item.key]}
        onCheckedChange={() => handleSwitch(item.key)}
      />
      <InfoValue className={cn("text-sm font-semibold", item.color)}>
        {item.label}
      </InfoValue>
      <InfoValue className="text-xl/tight font-semibold">
        {item.amount}
      </InfoValue>
    </div>
  );
};

export default ChartControlItem;
