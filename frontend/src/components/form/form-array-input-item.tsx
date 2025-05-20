import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FormArrayInputItemProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  label?: string;
  inputClassName?: string;
}

const FormArrayInputItem = <T extends FieldValues>({
  control,
  name,
  placeholder,
  required,
  label,
  inputClassName,
}: FormArrayInputItemProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex items-start justify-between gap-2">
          {label && (
            <div className="flex items-start justify-end gap-1 w-full">
              <FormLabel className="text-sm mt-1.5">
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
          <div className="flex flex-col gap-1.5">
            <FormControl>
              <Input
                {...field}
                placeholder={placeholder}
                className={cn(
                  "min-w-[278px] font-medium rounded-xs h-8 px-2.5 border-ui-border text-xs focus-visible:ring-[1px]",
                  inputClassName
                )}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormArrayInputItem;
