import { FormSwitchProps } from "@/types/form.typse";

import { FieldValues } from "react-hook-form";

import { FormControl, FormField, FormItem } from "../ui/form";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

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
        <FormItem>
          <FormControl>
            <div className="flex items-center gap-2">
              <Switch
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor={name} className="text-xs">
                {!unCheckedLabel && checkedLabel}
                {unCheckedLabel &&
                  (field.value === true ? checkedLabel : unCheckedLabel)}
              </Label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormSwitch;
