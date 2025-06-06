import { EnumItem, FilterGroup } from "@/types/shared.types";
import { Plus, SlidersHorizontal, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import SearchInput from "./search-input";

import Sort from "./sort";
import { useState } from "react";
import FilterDropdown from "./filter-dropdown";
import { toggleParam } from "@/lib/utils";

interface ToolbarFilterProps {
  sortOptions?: EnumItem<string>[];
  searchPlaceholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  showFilterButton?: boolean;
  filterOptions: FilterGroup[];
  filterPlaceholder?: string;
}

const Toolbar = ({
  sortOptions = [],
  searchPlaceholder = "Пошук",
  addLabel = "Додати",
  onAdd,
  showFilterButton = true,
  filterOptions,
  filterPlaceholder = "Фільтри",
}: ToolbarFilterProps) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const allParams = Object.fromEntries(searchParams.entries());

  const filterParams = Object.entries(allParams)
    .flatMap(([param, rawValue]) => {
      const values = rawValue.split(",");
      const filterOption = filterOptions.find((opt) => opt.param === param);

      return values.map((value) => {
        const filterOptionLabel = filterOption?.options?.find(
          (opt) => value === opt.value.toString()
        );

        return {
          param,
          value,
          label: filterOptionLabel?.label,
        };
      });
    })
    .filter(({ param }) => filterOptions.some((o) => o.param === param));

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 lg:mt-8">
        <div className="flex flex-1 flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-8 ">
          <div className="flex items-start lg:items-center gap-4">
            {sortOptions.length > 0 && <Sort options={sortOptions} />}
            {showFilterButton && (
              <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
                <Button
                  variant="ghost"
                  className="focus-visible:ring-0 cursor-pointer dark:hover:bg-transparent p-0 has-[>svg]:px-0"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <SlidersHorizontal className="size-4 text-text-light" />
                  <span className="text-xs text-text-light font-medium">
                    {filterPlaceholder}
                  </span>
                </Button>
                {filterParams.length > 0 &&
                  filterParams.map((param) => (
                    <Button
                      key={param.value}
                      variant="link"
                      className="text-action-plus text-xs hover:no-underline cursor-pointer"
                      onClick={() =>
                        toggleParam(
                          searchParams.toString(),
                          param.param,
                          param.value,
                          router
                        )
                      }
                    >
                      {param.label}
                      <XIcon />
                    </Button>
                  ))}
              </div>
            )}
          </div>
          {filterOpen && (
            <div className="flex overflow-x-auto lg:hidden gap-5 pb-1.5">
              <FilterDropdown filters={filterOptions} />
            </div>
          )}
          <div className="flex justify-between ">
            <SearchInput placeholder={searchPlaceholder} />
            {onAdd && (
              <Button onClick={onAdd} size="icon" className="flex lg:hidden">
                <Plus className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {onAdd && (
          <Button
            onClick={onAdd}
            className="hidden lg:flex whitespace-nowrap text-xs/tight font-semibold"
          >
            <Plus className="size-3" />
            {addLabel}
          </Button>
        )}
      </div>
      {filterOpen && (
        <div className="hidden lg:flex gap-5">
          <FilterDropdown filters={filterOptions} />
        </div>
      )}
    </div>
  );
};
export default Toolbar;
