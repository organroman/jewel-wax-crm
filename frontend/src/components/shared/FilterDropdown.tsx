"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { EnumItem, FilterGroup, FilterOption } from "@/types/shared.types";
import { Checkbox } from "../ui/checkbox";

interface FilterDropdownProps {
  filters: FilterGroup[];
  placeholder?: string;
}
//TODO
const FilterDropdown = ({
  filters,
  placeholder = "Фільтри",
}: FilterDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleParam = (param: string, value: string | boolean) => {
    const current = new URLSearchParams(searchParams.toString());
    const valueStr = String(value);
    const values = current.get(param)?.split(",").filter(Boolean) || [];

    const updated = values.includes(valueStr)
      ? values.filter((v) => v !== valueStr)
      : [...values, valueStr];

    if (updated.length > 0) {
      current.set(param, updated.join(","));
    } else {
      current.delete(param);
    }
    router.push(`?${current.toString()}`);
  };

  const isChecked = (param: string, value: string | boolean) => {
    const current = searchParams.get(param)?.split(",") || [];
    return current.includes(String(value));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 cursor-pointer  p-0 has-[>svg]:px-0"
        >
          <SlidersHorizontal className="size-4" />
          <span className="text-xs text-text-light font-medium">
            {placeholder}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto p-1">
        {filters.map((group) => (
          <DropdownMenuSub key={group.param}>
            <DropdownMenuSubTrigger className="cursor-pointer">
              {group.label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              {group.options.map((option) => (
                <DropdownMenuCheckboxItem
                  className="border-ui-border data-[state=checked]:bg-brand-default"
                  key={`${group.param}_${option.value}`}
                  checked={isChecked(group.param, option.value)}
                  onCheckedChange={() => toggleParam(group.param, option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
