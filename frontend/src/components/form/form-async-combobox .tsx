"use client";
import { FormAsyncComboboxProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const FormAsyncCombobox = <T extends FieldValues, O>({
  name,
  label,
  placeholder,
  control,
  options,
  required = false,
  className,
  displayKey,
  valueKey,
  searchQuery,
  setSearchQuery,
  saveFullObject = false,
  saveOnlyValue = false,
  disabled = false,
  isOptionsLoading,
}: FormAsyncComboboxProps<T, O>) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedLabel = (() => {
          if (
            !field.value ||
            (typeof field.value === "object" &&
              Object.keys(field.value).length === 0)
          )
            return placeholder || t("placeholders.choose");

          if (saveFullObject) {
            return field.value[displayKey ?? "label"];
          }
          if (saveOnlyValue) {
            const foundOption = options.find(
              (opt) => opt.value === field.value
            );

            return foundOption ? foundOption.label : placeholder;
          }
          return field.value?.label ?? placeholder;
        })();
        console.log(selectedLabel);

        return (
          <FormItem className="flex flex-col lg:flex-row gap-0.5 lg:gap-2.5">
            {label && (
              <div className="flex items-start justify-between">
                <FormLabel className="text-xs lg:text-sm mt-1.5">
                  {label}
                </FormLabel>
                {required && (
                  <Image
                    src="/img/star-required.svg"
                    alt="required"
                    width={4}
                    height={4}
                    className="mt-1"
                  />
                )}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <FormControl>
                <div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        type="button"
                        role="combobox"
                        variant="outline"
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          "min-w-[160px] lg:min-w-[240px] justify-between h-8 rounded-xs text-sm font-semibold relative",
                          className
                        )}
                        disabled={disabled}
                      >
                        {selectedLabel}
                        <div className="absolute top-1.5 right-2">
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className={cn(
                        "lg:w-[240px] p-0 max-h-64 overflow-y-auto"
                      )}
                    >
                      <Command
                        filter={(value, search) => {
                          const item = options.filter((opt) =>
                            opt.label
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          );

                          if (item?.length) return 1;

                          return 0;
                        }}
                      >
                        <CommandInput
                          placeholder={t("placeholders.choose")}
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        {isOptionsLoading && (
                          <Loader className="size-6 text-center text-brand-default my-2 animate-spin self-center" />
                        )}
                        {!isOptionsLoading && (
                          <CommandEmpty>
                            {t("messages.info.no_results")}
                          </CommandEmpty>
                        )}
                        <CommandGroup>
                          {options.map((option) => {
                            const label = displayKey
                              ? (option.data?.[displayKey] as string)
                              : option.label;

                            const value = valueKey
                              ? (option.data?.[valueKey] as string)
                              : option.value;

                            return (
                              <CommandItem
                                key={option.value + option.label}
                                value={value.toString()}
                                onSelect={() => {
                                  if (saveFullObject) {
                                    field.onChange(option.data);
                                  } else if (saveOnlyValue) {
                                    field.onChange(value);
                                  } else {
                                    field.onChange({ value, label });
                                  }
                                  setOpen(false);
                                }}
                              >
                                {label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default FormAsyncCombobox;
