import { FormCheckboxProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

const FormCheckbox = <T extends FieldValues>({
  label,
  name,
  control,
}: FormCheckboxProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="">
          <FormControl>
            <div className="flex items-center gap-2">
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel htmlFor={name} className="text-xs">
                {label}
              </FormLabel>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;
