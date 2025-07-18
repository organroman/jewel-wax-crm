import { FilterOption } from "@/types/shared.types";

import { Dispatch, SetStateAction } from "react";
import { ChevronUp, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
import { Checkbox } from "@components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FilterAsyncComboboxProps {
  open: boolean;
  handleOpenChange: (value: boolean) => void;
  label: string;
  isLoading?: boolean;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;

  options: FilterOption[];
  param: string;
  handleSelect: (param: string, value: string) => void;
  isChecked?: (value: string) => boolean;
}

const FilterAsyncCombobox = ({
  open,
  handleOpenChange,
  searchQuery = "",
  setSearchQuery,
  isLoading,
  label,
  options,
  param,
  handleSelect,
  isChecked,
}: FilterAsyncComboboxProps) => {
  const { t } = useTranslation();
  return (
    <Popover
      open={open || false}
      onOpenChange={(value) => handleOpenChange(value)}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          variant="outline"
          className={cn(
            "min-w-[180px] justify-between bg-ui-sidebar h-8 rounded-md text-sm font-semibold relative hover:border-text-light"
          )}
        >
          {label}
          <ChevronUp
            className={cn(
              "transition-transform duration-300",
              !open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[180px] p-0 max-h-64 overflow-y-auto">
        <Command
          filter={(value, search) => {
            const item = options.filter((opt) =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            );

            return item?.length ? 1 : 0;
          }}
        >
          <CommandInput
            placeholder="Пошук..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {isLoading && (
            <Loader className="size-6 text-center text-brand-default my-2 animate-spin self-center" />
          )}
          {!isLoading && (
            <CommandEmpty>{t("messages.info.no_results")}</CommandEmpty>
          )}
          <CommandGroup>
            {options?.map((option) => {
              return (
                <CommandItem
                  key={option.value.toString()}
                  value={option.value.toString()}
                  onSelect={() => {
                    handleSelect(param, option.value.toString());
                  }}
                >
                  <Checkbox
                    checked={isChecked && isChecked(option.value.toString())}
                  />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterAsyncCombobox;
