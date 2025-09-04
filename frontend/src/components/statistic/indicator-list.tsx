import { IndicatorData } from "@/types/statistic.types";
import IndicatorItem from "./indicator-item";

interface IndicatorsListProps {
  indicatorsData: IndicatorData[];
}

const IndicatorsList = ({ indicatorsData }: IndicatorsListProps) => {
  return (
    <div className="flex flex-row gap-5 w-full">
      {indicatorsData.map((indicator) => (
        <div key={indicator.label} className="w-full">
          <IndicatorItem indicator={indicator} />
        </div>
      ))}
    </div>
  );
};

export default IndicatorsList;
