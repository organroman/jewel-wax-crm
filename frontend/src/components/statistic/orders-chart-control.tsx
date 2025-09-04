import { ControlItem, Dict } from "@/types/statistic.types";

import React, { Dispatch, Fragment, SetStateAction } from "react";

import ChartControlItem from "./chart-control-item";

interface OrdersChartControlProps<K extends string> {
  data: ControlItem<K>[];
  selectedItem: Dict<K>;
  setSelectedItem: Dispatch<SetStateAction<Record<K, boolean>>>;
}

const OrdersChartControl = <K extends string>({
  data,
  selectedItem,
  setSelectedItem,
}: OrdersChartControlProps<K>) => {
  const handleSwitch = (key: K) => {
    setSelectedItem((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div className="flex items-center justify-between">
      {data.map((i) => (
        <Fragment key={i.key}>
          <ChartControlItem
            item={i}
            selectedStage={selectedItem}
            handleSwitch={handleSwitch}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default OrdersChartControl;
