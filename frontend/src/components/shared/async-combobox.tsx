"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ChevronDown, ChevronUp, Loader, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as RadixPopover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Option<T> = {
  label: string;
  value: string | number;
  data?: T;
};

type AsyncComboboxProps<T> = {
  label?: string;
  placeholder?: string;
  options: Option<T>[];
  value?: Option<T> | null;
  onChange: (selected: Option<T> | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  popoverContentClassName?: string;
  displayKey?: keyof T;
  valueKey?: keyof T;
  search: string;
  displayFn?: (item: T) => string;
  setSearch?: Dispatch<SetStateAction<string>> | ((value: string) => void);
  labelPosition?: "left" | "top";
  triggerHeight?: string;
};

const AsyncCombobox = <T,>({
  label,
  placeholder,
  options,
  value,
  onChange,
  isLoading = false,
  disabled = false,
  className,
  displayKey,
  valueKey,
  search,
  setSearch,
  popoverContentClassName,
  labelPosition = "left",
  triggerHeight,
  displayFn,
}: AsyncComboboxProps<T>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedLabel = (() => {
    if (!value) return placeholder || t("placeholders.choose");

    if (value.data && displayKey) {
      return value.data[displayKey] as string;
    }

    if (value.data && displayFn) {
      return displayFn(value.data);
    }

    return value.label;
  })();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <span className="text-xs text-text-muted lg:text-sm/3.5 font-medium">
          {label}
        </span>
      )}

      <RadixPopover.Popover open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <Button
            type="button"
            role="combobox"
            variant="outline"
            className={cn(
              "min-w-[240px] max-w-[240px] justify-between h-8 rounded-xs text-sm font-semibold relative",
              className,
              triggerHeight
            )}
            disabled={disabled}
          >
            <span className="truncate overflow-hidden whitespace-nowrap w-full text-left">
              {selectedLabel}
            </span>
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </RadixPopover.Trigger>
        <RadixPopover.Content
          className={cn(
            "w-full p-0 max-h-64 overflow-y-auto fixed z-[9999] overflow-auto ",
            popoverContentClassName
          )}
          align="start"
        >
          <Command
            filter={(value, search) => {
              const item = options.filter((opt) =>
                opt.label.toLowerCase().includes(search.toLowerCase())
              );

              return item?.length ? 1 : 0;
            }}
          >
            <CommandInput
              placeholder={t("placeholders.choose")}
              value={search}
              onValueChange={setSearch}
            />

            {isLoading && (
              <Loader className="size-6 text-center text-brand-default my-2 animate-spin self-center" />
            )}

            {!isLoading && (
              <CommandEmpty>{t("messages.info.no_results")}</CommandEmpty>
            )}
            {value && (
              <CommandItem
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <XIcon className="size-4" /> {t("buttons.delete")}
              </CommandItem>
            )}

            <CommandGroup className="z-100 overflow-y-scroll ">
              {options.map((option) => {
                const label = displayKey
                  ? (option.data?.[displayKey] as string)
                  : option.label;

                const value = valueKey
                  ? (option.data?.[valueKey] as string | number)
                  : option.value;

                return (
                  <CommandItem
                    key={value}
                    value={value.toString()}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </RadixPopover.Content>
      </RadixPopover.Popover>
    </div>
  );
};

export default AsyncCombobox;
