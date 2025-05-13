import { EnumItem, FilterGroup } from "@/types/shared.types";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import SearchInput from "./search-input";

import FilterDropdown from "./filter-dropdown";
import Sort from "./Sort";

interface ToolbarFilterProps {
  sortOptions?: EnumItem[];
  searchPlaceholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  showFilterButton?: boolean;
  filterOptions: FilterGroup[];
}

const Toolbar = ({
  sortOptions = [],
  searchPlaceholder = "Пошук",
  addLabel = "Додати",
  onAdd,
  showFilterButton = true,
  filterOptions,
}: ToolbarFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8">
      <div className="flex flex-1 items-center gap-8 flex-wrap">
        {sortOptions.length > 0 && <Sort options={sortOptions} />}
        {showFilterButton && <FilterDropdown filters={filterOptions} />}
        <SearchInput placeholder={searchPlaceholder} />
      </div>

      {onAdd && (
        <Button
          onClick={onAdd}
          className="whitespace-nowrap text-xs/tight font-semibold"
        >
          <Plus className="size-3" />
          {addLabel}
        </Button>
      )}
    </div>
  );
};
export default Toolbar;
