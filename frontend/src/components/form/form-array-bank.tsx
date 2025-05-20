import { FormArrayBankDetailsProps } from "@/types/form.types";

import {
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import FormArrayInputItem from "./form-array-input-item";

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
      is_main: !watchedFields || watchedFields.length === 0 ? true : false,
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
    <div className="flex justify-between flex-wrap gap-5">
      {fields.map((field, index) => {
        const base = `${name}.${index}` as Path<T>;
        const isMain = watchedFields?.[index]?.is_main ?? false;

        return (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex flex-col gap-2.5">
              <FormArrayInputItem
                control={control}
                name={`${base}.bank_name` as Path<T>}
                placeholder="Введіть назву банку"
                label="Банк"
                required={required}
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.bank_code` as Path<T>}
                placeholder="Введіть МФО"
                label="МФО"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.tax_id` as Path<T>}
                placeholder="Введіть ІПН/ЄДРПОУ"
                label="ІПН/ЄДРПОУ"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.iban` as Path<T>}
                placeholder="Введіть IBAN"
                label="IBAN"
                required={required}
                inputClassName="min-w-[278px]"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.card_number` as Path<T>}
                placeholder="Введіть номер карти"
                label="Номер карти"
                required={required}
              />
            </div>
            <div className="flex items-center mt-1.5 gap-2">
              <Switch
                checked={isMain}
                onCheckedChange={() => handleToggleMain(index)}
              />
              <Label className="text-xs">Основний</Label>
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
            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleAppend}
                className="text-action-plus text-xs px-0"
              >
                Додати ще
              </Button>
            )}
          </div>
        );
      })}

      {fields.length === 0 && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={handleAppend}
          className="text-action-plus text-xs px-0"
        >
          Додати
        </Button>
      )}
    </div>
  );
};

export default FormArrayBankDetails;
