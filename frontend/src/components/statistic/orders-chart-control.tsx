import { Stage } from "@/types/order.types";
import { ControlItem } from "@/types/statistic.types";

import React, { Dispatch, Fragment, SetStateAction } from "react";

import ChartControlItem from "./chart-control-item";

interface OrdersChartControlProps {
  data: ControlItem[];
  selectedStage: Record<Stage, boolean>;
  setSelectedStage: Dispatch<SetStateAction<Record<Stage, boolean>>>;
}

const OrdersChartControl = ({
  data,
  selectedStage,
  setSelectedStage,
}: OrdersChartControlProps) => {
  const handleSwitch = (stage: Stage) => {
    setSelectedStage((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };
  return (
    <div className="flex items-center justify-between">
      {data.map((i) => (
        <Fragment key={i.key}>
          <ChartControlItem
            item={i}
            selectedStage={selectedStage}
            handleSwitch={handleSwitch}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default OrdersChartControl;
