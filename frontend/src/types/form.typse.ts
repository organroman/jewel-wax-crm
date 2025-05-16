import { Control, FieldValues, Path } from "react-hook-form";

export interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  checkedLabel: string;
  unCheckedLabel?: string;
}
