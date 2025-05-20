import { FormSelectProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";
import Image from "next/image";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

const FormSelect = <T extends FieldValues, O>({
  name,
  label,
  placeholder,
  control,
  options,
  required = false,
  className,
}: FormSelectProps<T, O>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className=" flex items-center gap-2.5">
            {label && (
              <div className="flex items-start justify-end gap-1 w-full">
                <FormLabel className="text-text-muted font-normal text-sm">
                  {label}
                </FormLabel>
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
            <Select
              value={field.value?.value ?? ""}
              onValueChange={(val) => {
                const selected = options.find((opt) => opt.value === val);
                if (selected) {
                  field.onChange({
                    value: selected.value,
                    label: selected.label,
                  });
                }
              }}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "min-w-[240px] h-8 rounded-xs text-sm font-semibold focus-visible:ring-[1px]",
                    className
                  )}
                >
                  <SelectValue
                    placeholder={placeholder || "Make your choice"}
                  />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelect;
