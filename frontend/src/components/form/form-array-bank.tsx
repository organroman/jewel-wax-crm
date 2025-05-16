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
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import FormArrayInputItem from "./form-array-input-item";
import { FormLabel } from "../ui/form";

interface FormArrayBankDetailsProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  required?: boolean;
}

const FormArrayBankDetails = <T extends FieldValues>({
  name,
  control,
  setValue,
  required = false,
}: FormArrayBankDetailsProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });

  const handleAppend = () => {
    append({
      bank_name: "",
      bank_code: "",
      iban: "",
      tax_id: "",
      card_number: "",
      is_main: false,
    } as any);
  };

  const handleToggleMain = (index: number) => {
    fields.forEach((_, i) => {
      setValue(
        `${name}.${i}.is_main` as Path<T>,
        (i === index) as PathValue<T, any>
      );
    });
  };

  return (
    <div className="flex justify-between">
      {fields.map((field, index) => {
        const base = `${name}.${index}` as Path<T>;
        const isMain = watchedFields?.[index]?.is_main ?? false;

        return (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex flex-col gap-2.5">
              <FormArrayInputItem
                control={control}
                name={`${base}.bank_name` as Path<T>}
                placeholder="Назва банку"
                label="Банк"
                required={required}
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.bank_code` as Path<T>}
                placeholder="МФО"
                label="МФО"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.tax_id` as Path<T>}
                placeholder="ІПН/ЄДРПОУ"
                label="ІПН/ЄДРПОУ"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.iban` as Path<T>}
                placeholder="IBAN"
                label="IBAN"
                required={required}
                inputClassName="min-w-[278px]"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.card_number` as Path<T>}
                placeholder="1111 1111 1111 1111"
                label="Номер карти"
                required={required}
              />
            </div>
            <div className="flex items-center mt-1.5 gap-2">
              <Switch
                checked={isMain}
                onCheckedChange={() => handleToggleMain(index)}
              />
              <FormLabel className="text-xs">Основний</FormLabel>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghostDestructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={handleAppend}
        className="text-action-plus text-xs"
      >
        Додати ще
      </Button>
    </div>
  );
};

export default FormArrayBankDetails;
