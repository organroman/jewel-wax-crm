"use client";

import { FormDatePickerProps } from "@/types/form.types";
import { format } from "date-fns";
import Image from "next/image";
import { FieldValues } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const FormDatePicker = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  required = false,
  labelPosition = "left",
  inputStyles,
  isFullWidth = false,
}: FormDatePickerProps<T>) => {
  const { t } = useTranslation();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-col gap-0.5 lg:gap-2.5",
            labelPosition === "top"
              ? "lg:flex-col lg:gap-0.5"
              : "lg:flex-row lg:gap-0.5",
            isFullWidth && "w-full"
          )}
        >
          {label && (
            <div
              className={cn(
                "flex mt-1.5 items-start gap-1 w-full",
                labelPosition === "top"
                  ? "lg:justify-start mt-0"
                  : "lg:justify-end"
              )}
            >
              <FormLabel className="text-sm">{label}</FormLabel>
              {required && (
                <Image
                  src="/img/star-required.svg"
                  alt="required"
                  width={4}
                  height={4}
                  className="self-start mt-1"
                />
              )}
            </div>
          )}
          <div className={cn("flex flex-col gap-1", isFullWidth && "flex-1")}>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left text-text-regular hover:text-text-light h-8 px-2.5 text-sm",
                      !field.value && "text-muted-foreground",
                      inputStyles
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-text-regular hover:text-text-light" />
                    {field.value
                      ? format(field.value, "dd.MM.yyyy")
                      : placeholder || t("placeholder.choose_date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker;
