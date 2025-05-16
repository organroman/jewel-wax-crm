import { useEffect, useState } from "react";
import {
  AsYouType,
  parsePhoneNumberFromString,
  CountryCode,
} from "libphonenumber-js";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FormPhoneInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  defaultCountry?: CountryCode;
  required?: boolean;
};

const FormPhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  defaultCountry = "UA",
  required = false,
}: FormPhoneInputProps<T>) => {
  const [formattedValue, setFormattedValue] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        useEffect(() => {
          if (field.value) {
            const parsed = parsePhoneNumberFromString(field.value);
            setFormattedValue(parsed?.formatInternational() || field.value);
          }
        }, [field.value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawInput = e.target.value;
          const asYouType = new AsYouType(defaultCountry);
          const formatted = asYouType.input(rawInput);
          const parsed = parsePhoneNumberFromString(rawInput, defaultCountry);

          setFormattedValue(formatted);

          field.onChange(parsed?.isValid() ? parsed.number : rawInput);
        };

        return (
          <FormItem className="flex justify-between gap-2.5">
            {label && (
              <div className="flex mt-1.5 items-start justify-end gap-1 w-full">
                <FormLabel className="text-text-muted font-normal text-sm">
                  {label}
                </FormLabel>

                <Image
                  src="/img/star-required.svg"
                  alt="star"
                  width={4}
                  height={4}
                  className={cn("self-start mt-1", !required &&"opacity-0")}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <FormControl>
                <Input
                  value={formattedValue}
                  onChange={handleChange}
                  placeholder="+38 (067) 123 45 67"
                  className="min-w-[240px] font-medium rounded-xs h-8 px-2.5 border-ui-border text-xs focus-visible:ring-[1px]"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default FormPhoneInput;
