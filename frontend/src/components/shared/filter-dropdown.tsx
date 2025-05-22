"use client";
import { FilterGroup } from "@/types/shared.types";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { toggleParam } from "@/lib/utils";

import StaticCombobox from "./static-combobox";
import AsyncComboBox from "./async-combobox";

interface FilterDropdownProps {
  filters: FilterGroup[];
}

const FilterDropdown = ({ filters }: FilterDropdownProps) => {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const handleOpenChange = (param: string, value: boolean) => {
    setOpenStates((prev) => ({
      ...prev,
      [param]: value,
    }));
  };
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (param: string, value: string) => {
    toggleParam(searchParams.toString(), param, value, router);
  };

  const isChecked = (param: string, value: string | boolean) => {
    const current = searchParams.get(param)?.split(",") || [];
    return current.includes(String(value));
  };

  return (
    <div className="flex gap-5">
      {filters.map((group) => (
        <div className="flex" key={group.param}>
          {group.async ? (
            <AsyncComboBox
              open={openStates[group.param]}
              handleOpenChange={(value) => handleOpenChange(group.param, value)}
              label={group.label}
              options={group.options || []}
              isLoading={group.isLoading}
              searchQuery={group.searchQuery}
              setSearchQuery={group.setSearchQuery}
              param={group.param}
              handleSelect={handleSelect}
              isChecked={(value) => isChecked(group.param, value)}
            />
          ) : (
            <StaticCombobox
              open={openStates[group.param]}
              handleOpenChange={(value) => handleOpenChange(group.param, value)}
              label={group.label}
              hasSearch={group.hasSearch}
              options={group.options || []}
              param={group.param}
              handleSelect={handleSelect}
              isChecked={(value) => isChecked(group.param, value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterDropdown;
