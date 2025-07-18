"use client";
import { FormComboboxProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";

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

const FormCombobox = <T extends FieldValues, O>({
  name,
  label,
  placeholder,
  control,
  options,
  required = false,
  className,
  displayKey,
  valueKey,
  saveFullObject = false,
  saveOnlyValue = false,
  disabled = false,
  isFullWidth,
}: FormComboboxProps<T, O>) => {
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
            if (field.value[displayKey ?? "label"] === "") {
              return placeholder;
            }
            return field.value[displayKey ?? "label"] ?? placeholder;
          }
          if (saveOnlyValue) {
            const foundOption = options.find(
              (opt) => opt.value === field.value
            );

            return foundOption ? foundOption.label : placeholder;
          }

          return field.value?.label ?? placeholder;
        })();

        const isSelectedValue = (() => {
          if (
            selectedLabel !== placeholder &&
            selectedLabel !== t("placeholders.choose")
          ) {
            return true;
          }
          return false;
        })();

        return (
          <FormItem
            className={cn(
              "flex flex-col lg:flex-row gap-0.5 lg:gap-2.5",
              isFullWidth && "w-full lg:w-fit"
            )}
          >
            {label && (
              <div className="flex items-start justify-between">
                <FormLabel className="text-xs lg:text-sm lg:mt-1.5">
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
            <div
              className={cn(
                "flex flex-col gap-0.5 lg:gap-1",
                isFullWidth && "w-full"
              )}
            >
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
                          " min-w-[160px] lg:min-w-[240px] lg:max-w-[240px] justify-between h-8 rounded-xs text-sm font-medium text-text-light relative",
                          isSelectedValue && "text-text-regular",
                          className
                        )}
                        disabled={disabled}
                      >
                        <span className="truncate overflow-hidden whitespace-nowrap w-full text-left">
                          {selectedLabel}
                        </span>
                        <div className="absolute top-1.5 right-2">
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[240px] p-0 max-h-64 overflow-y-auto">
                      <Command>
                        <CommandInput placeholder={t("placeholders.search")} />
                        <CommandEmpty>
                          {t("messages.info.no_results")}
                        </CommandEmpty>
                        {isSelectedValue && (
                          <CommandItem
                            onSelect={() => {
                              if (saveOnlyValue) {
                                field.onChange("");
                              } else {
                                field.onChange(null);
                              }
                              setOpen(false);
                            }}
                            className="text-action-minus data-[selected=true]:bg-accent-pink data-[selected=true]:text-action-minus"
                          >
                            <XIcon className="size-4 text-action-minus group-hover:text-action-alert" />{" "}
                            {t("buttons.delete")}
                          </CommandItem>
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
                                key={value}
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

export default FormCombobox;
