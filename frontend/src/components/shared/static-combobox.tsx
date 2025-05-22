import { FilterOption } from "@/types/shared.types";

import { ChevronUp } from "lucide-react";

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
  CommandList,
} from "@components/ui/command";
import { Checkbox } from "@components/ui/checkbox";

import { cn } from "@/lib/utils";

interface StaticComboboxProps {
  open: boolean;
  handleOpenChange: (value: boolean) => void;
  label: string;
  hasSearch?: boolean;
  options: FilterOption[];
  param: string;
  handleSelect: (param: string, value: string) => void;
  isChecked: (value: string) => boolean;
}

const StaticCombobox = ({
  open,
  handleOpenChange,
  label,
  hasSearch = false,
  options,
  param,
  handleSelect,
  isChecked,
}: StaticComboboxProps) => {
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
            "min-w-[180px] justify-between h-8 rounded-md text-sm font-semibold relative hover:bg-white hover:border-text-light"
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
            const item = options.find((opt) =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            );

            if (item?.value === +value) {
              return 1;
            }
            return 0;
          }}
        >
          {hasSearch && <CommandInput placeholder="Пошук..." />}
          <CommandList>
            <CommandEmpty>Нічого не знайдено</CommandEmpty>
            <CommandGroup>
              {options?.map((option: FilterOption) => {
                return (
                  <CommandItem
                    key={option.value.toString()}
                    value={option.value.toString()}
                    keywords={[option.label]}
                    onSelect={() => {
                      handleSelect(param, option.value.toString());
                    }}
                  >
                    <Checkbox checked={isChecked(option.value.toString())} />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StaticCombobox;
