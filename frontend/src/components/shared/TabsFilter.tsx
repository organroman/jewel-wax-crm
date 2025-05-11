"use client";

import { EnumItem } from "@/types/shared.types";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsFilterProps {
  param: string;
  options: EnumItem[];
}

const TabsFilter = ({ param, options }: TabsFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get(param) || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={current}
      value={current}
      onValueChange={handleChange}
      className="mt-7.5"
    >
      <TabsList className="w-full justify-start gap-6 border-none  bg-transparent p-0">
        {options.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="p-0 grow-0 font-semibold pb-5 cursor-pointer text-black data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabsFilter;
