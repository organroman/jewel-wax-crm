"use client";

import Image from "next/image";
import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { FormInputProps } from "@/types/form.types";
import { cn } from "@/lib/utils";

const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  fieldType = "input",
  type = "text",
  rows,
  required = false,
  labelPosition = "left",
  inputStyles,
  isFullWidth = false,
  defaultValue,
}: FormInputProps<T>) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem
        className={cn(
          "flex flex-col gap-0.5 lg:gap-2.5",
          labelPosition === "top"
            ? "lg:flex-col lg:gap-0.5"
            : "lg:flex-row lg:0.5",
          isFullWidth && "flex-1"
        )}
      >
        {label && (
          <div
            className={cn(
              "flex mt-1.5 items-start gap-1 w-full",
              labelPosition === "top" ? "lg:justify-start" : "lg:justify-end"
            )}
          >
            <FormLabel className=" text-sm">{label}</FormLabel>
            {required && (
              <Image
                src="/img/star-required.svg"
                alt="star"
                width={4}
                height={4}
                className="self-start mt-1"
              />
            )}
          </div>
        )}
        <div className={cn("flex flex-col gap-1", isFullWidth && "flex-1")}>
          <FormControl>
            {fieldType === "textarea" ? (
              <Textarea {...field} placeholder={placeholder} rows={rows} />
            ) : (
              <Input
                className={cn(
                  "min-w-[240px] font-medium rounded-xs h-8 px-2.5 border-ui-border text-sm focus-visible:ring-[1px]",
                  inputStyles
                )}
                {...field}
                placeholder={placeholder}
                type={type}
                defaultValue={defaultValue}
              />
            )}
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    )}
  />
);

export default FormInput;
