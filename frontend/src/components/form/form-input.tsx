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

const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  fieldType = "input",
  type = "text",
  rows,
  required = false,
}: FormInputProps<T>) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem className=" flex gap-2.5">
        {label && (
          <div className="flex mt-1.5 items-start justify-end gap-1 w-full">
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
        <div className="flex flex-col gap-1">
          <FormControl>
            {fieldType === "textarea" ? (
              <Textarea {...field} placeholder={placeholder} rows={rows} />
            ) : (
              <Input
                className="min-w-[240px] font-medium rounded-xs h-8 px-2.5 border-ui-border text-sm focus-visible:ring-[1px]"
                {...field}
                placeholder={placeholder}
                type={type}
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
