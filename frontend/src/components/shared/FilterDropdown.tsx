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
import { EnumItem, FilterOption } from "@/types/shared.types";
import { Checkbox } from "../ui/checkbox";

interface FilterDropdownProps {
  filters: FilterOption[];
  placeholder?: string;
}

const FilterDropdown = ({
  filters,
  placeholder = "Фільтри",
}: FilterDropdownProps) => {

  //TODO: COMPLETE FILTER LOGIC
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 cursor-pointer  p-0 has-[>svg]:px-0"
        >
          <SlidersHorizontal className="size-4" />
          <span className="text-xs text-text-light font-medium">Фільтри</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto p-1">
        {filters.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            //   onClick={() => handleChange(opt.value)}
            className="text-xs"
          >
            {/* <DropdownCh
            <Checkbox id={opt.value} />
            <label htmlFor={opt.value}> {opt.label}</label> */}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
