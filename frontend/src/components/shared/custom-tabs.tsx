import React, { Dispatch, SetStateAction, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabOption } from "@/types/shared.types";

interface CustomTabsProps {
  tabsOptions: TabOption[];
  isModal?: boolean;
  selectedTab?: TabOption;
  handleChange?: (value: string) => void;
}

const CustomTabs = ({
  tabsOptions,
  selectedTab,
  handleChange,
  isModal,
}: CustomTabsProps) => {
  const firstTab = tabsOptions[0];

  return (
    <Tabs
      defaultValue={selectedTab?.value}
      value={selectedTab?.value}
      onValueChange={handleChange}
      // className="mt-7.5"
      className="mt-5"
    >
      <TabsList className="w-full justify-start gap-6 border-none bg-transparent p-0">
        {isModal && (
          <TabsTrigger
            value={firstTab.value}
            className="p-0 grow-0 font-semibold pb-4 cursor-pointer text-black data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
          >
            {firstTab.label}
          </TabsTrigger>
        )}
        {!isModal &&
          tabsOptions.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="p-0 grow-0 font-semibold pb-4 cursor-pointer text-black data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
            >
              {t.label}
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
};

export default CustomTabs;
