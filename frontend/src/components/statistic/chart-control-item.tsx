import { ControlItem, Dict } from "@/types/statistic.types";

import { Switch } from "../ui/switch";
import InfoValue from "../shared/typography/info-value";

import { cn } from "@/lib/utils";

interface ChartControlItemProps<K extends string> {
  item: ControlItem<K>;
  selectedStage: Dict<K>;
  handleSwitch: (key: K) => void;
}

const ChartControlItem = <K extends string>({
  item,
  selectedStage,
  handleSwitch,
}: ChartControlItemProps<K>) => {
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
