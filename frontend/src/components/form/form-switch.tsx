import { FormSwitchProps } from "@/types/form.types";

import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

const FormSwitch = <T extends FieldValues>({
  checkedLabel,
  unCheckedLabel,
  name,
  control,
}: FormSwitchProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="">
          <FormControl>
            <div className="flex items-center gap-2">
              <Switch
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel htmlFor={name} className="text-xs">
                {!unCheckedLabel && checkedLabel}
                {unCheckedLabel &&
                  (field.value === true ? checkedLabel : unCheckedLabel)}
              </FormLabel>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSwitch;
