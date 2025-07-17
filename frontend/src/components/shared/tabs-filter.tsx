"use client";

import { TabOption } from "@/types/shared.types";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface TabsFilterProps {
  param: string;
  options: TabOption[];
  counts?: Record<string, number>;
}

const TabsFilter = ({ param, options, counts }: TabsFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get(param) || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

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
      className="mt-2 lg:mt-7.5"
    >
      <TabsList className="w-full overflow-x-auto justify-start gap-4 border-none  bg-transparent px-1 ">
        {options.map(({ value, label }) => {
          return (
            <TabsTrigger
              key={value}
              value={value}
              className="p-0 grow-0 flex items-center font-semibold pb-5 cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
            >
              {label} {/* {counts && counts?.[value] && ( */}
              <Badge
                className={cn(
                  "bg-transparent block p-0 text-sm font-medium text-brand-default",
                  value !== "all" && "w-[12px]"
                )}
              >
                {counts && counts?.[value] && counts?.[value]}
                {/* counts?.[value]} */}
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default TabsFilter;
