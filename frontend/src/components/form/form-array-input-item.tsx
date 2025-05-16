import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

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
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required },
  });

  return (
    <div className="flex items-center justify-between gap-2">
      {label && <FormLabel className="text-xs">{label}</FormLabel>}
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            className={cn("min-w-[278px] font-medium rounded-xs h-8 px-2.5 border-ui-border text-xs focus-visible:ring-[1px]",
                inputClassName
            )}
          />
        </FormControl>
      </FormItem>
    </div>
  );
};

export default FormArrayInputItem;
