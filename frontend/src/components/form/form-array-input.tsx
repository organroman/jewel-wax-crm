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
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import FormInput from "./form-input";

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
    <div className="space-y-2">
      {label && <p className="text-sm font-medium mb-1">{label}</p>}

      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;

        return (
          <div key={field.id} className="flex items-center gap-2">
            <FormInput
              control={control}
              name={`${name}.${index}.${fieldKey}` as Path<T>}
              placeholder={placeholder}
              required={required && index === 0}
            />
            {showIsMain && (
              <Switch
                checked={isMain}
                onCheckedChange={() => handleToggleMain(index)}
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={handleAppend}>
        <Plus className="size-4 mr-1" />
        Додати ще
      </Button>
    </div>
  );
};

export default FormArrayInput;
