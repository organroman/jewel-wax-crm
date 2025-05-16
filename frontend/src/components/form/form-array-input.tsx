import {
  ArrayPath,
  Control,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { FormLabel } from "../ui/form";
import FormArrayInputItem from "./form-array-input-item";


interface FormArrayInputProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fieldKey?: string;
  showIsMain?: boolean;
}

const FormArrayInput = <T extends FieldValues>({
  name,
  control,
  setValue,
  label,
  placeholder,
  required = false,
  fieldKey = "value",
  showIsMain = false,
}: FormArrayInputProps<T>) => {

  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });

  const handleToggleMain = (index: number) => {
    fields.forEach((_, i) => {
      setValue(
        `${name}.${i}.is_main` as any,
        (i === index) as PathValue<T, any>
      );
    });
  };

  const handleAppend = () => {
    append({ [fieldKey]: "", is_main: false } as any);
  };

  return (
    <div className="space-y-2 flex flex-wrap gap-5">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;

        const inputName = `${name}.${index}.${fieldKey}` as Path<T>;

        return (
          <div key={field.id} className="flex items-center gap-2">
            <FormArrayInputItem
              key={field.id}
              name={inputName}
              control={control}
              label={label}
              placeholder={placeholder}
              required={required && index === 0}
            />

            {showIsMain && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={isMain}
                  onCheckedChange={() => handleToggleMain(index)}
                />
                <FormLabel className="text-xs">Основний</FormLabel>
              </div>
            )}
            <Button
              type="button"
              variant="ghostDestructive"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        variant="link"
        size="sm"
        className="text-action-plus text-xs"
        onClick={handleAppend}
      >
        Додати ще
      </Button>
    </div>
  );
};

export default FormArrayInput;
