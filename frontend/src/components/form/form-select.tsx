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
import { useTranslation } from "react-i18next";

const FormSelect = <T extends FieldValues, O>({
  name,
  label,
  placeholder,
  control,
  options,
  required = false,
  className,
  labelPosition = "left",
  isFullWidth,
}: FormSelectProps<T, O>) => {
  const { t } = useTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              "flex flex-col  lg:flex-row lg:items-center gap-0.5 lg:gap-2.5",
              labelPosition === "top" &&
                "lg:flex-col lg:gap-0.5 lg:items-start",
              isFullWidth && "w-full"
            )}
          >
            {label && (
              <div
                className={cn(
                  "flex items-start lg:justify-end gap-1 w-full",
                  labelPosition === "top" && "lg:justify-start"
                )}
              >
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
                  size="sm"
                  className={cn(
                    "w-full lg:min-w-[240px] h-8 rounded-xs text-sm font-semibold focus-visible:ring-[1px] text-text-muted hover:text-text-regular",
                    className
                  )}
                >
                  <SelectValue
                    placeholder={placeholder || t("placeholders.choose")}
                  />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
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
