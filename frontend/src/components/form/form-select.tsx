import { FormSelectProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";
import Image from "next/image";
import { XIcon } from "lucide-react";

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
  labelClassName,
  disabled = false,
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
              "flex flex-col lg:flex-row lg:items-center lg:justify-start gap-0.5 lg:gap-2.5",
              labelPosition === "top" &&
                "lg:flex-col lg:gap-0.5 lg:items-start",
              isFullWidth && "w-full"
            )}
          >
            {label && (
              <div
                className={cn(
                  "flex items-start lg:justify-end gap-1 w-full",
                  labelPosition === "top" && "lg:justify-start",
                  labelClassName
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
                if (val === "__clear__") {
                  field.onChange(null);
                  return;
                }
                const selected = options.find((opt) => opt.value === val);
                if (selected) {
                  field.onChange({
                    value: selected.value,
                    label: selected.label,
                  });
                }
              }}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  size="sm"
                  className={cn(
                    "w-full lg:min-w-[240px] h-8 rounded-xs text-sm focus-visible:ring-[1px] text-text-regular hover:text-text-light",
                    className
                  )}
                >
                  <SelectValue
                    placeholder={placeholder || t("placeholders.choose")}
                  />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {field.value?.value && (
                  <SelectItem
                    value="__clear__"
                    className={cn(
                      "text-action-minus focus:text-action-minus focus:bg-accent-pink"
                    )}
                  >
                    <XIcon className="text-action-minus group-hover:text-action-alert" />
                    {t("buttons.clear")}
                  </SelectItem>
                )}
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
