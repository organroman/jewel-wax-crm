import { FormArrayBankDetailsProps } from "@/types/form.types";

import {
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          <div
            key={field.id}
            className="flex w-full lg:w-fit flex-col lg:flex-row items-start justify-start gap-3"
          >
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex items-end lg:items-center gap-2.5">
                <FormArrayInputItem
                  control={control}
                  name={`${base}.bank_name` as Path<T>}
                  placeholder={t("person.placeholders.bank")}
                  label={t("person.labels.bank")}
                  required={required}
                  labelClassName="lg:justify-start lg:w-[100px]"
                />
                <div className="flex mb-1.5 lg:mb-0 items-center gap-2">
                  <Switch
                    checked={isMain}
                    onCheckedChange={() => handleToggleMain(index)}
                  />
                  <Label className="hidden lg:block text-xs">
                    {t("labels.main")}
                  </Label>
                  <Label className="block lg:hidden text-xs">
                    {t("labels.main_short")}
                  </Label>
                </div>

                <div className="flex">
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
              <FormArrayInputItem
                control={control}
                name={`${base}.bank_code` as Path<T>}
                placeholder={t("person.placeholders.bank_code")}
                label={t("person.labels.bank_code")}
                labelClassName="lg:justify-start lg:w-[100px]"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.tax_id` as Path<T>}
                placeholder={t("person.placeholders.tax_id")}
                label={t("person.labels.tax_id")}
                labelClassName="lg:justify-start lg:w-[100px]"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.iban` as Path<T>}
                placeholder={t("person.placeholders.iban")}
                label="IBAN"
                required={required}
                inputClassName="min-w-[188px]"
                labelClassName="lg:justify-start lg:w-[100px]"
              />
              <FormArrayInputItem
                control={control}
                name={`${base}.card_number` as Path<T>}
                placeholder={t("person.placeholders.card_number")}
                label={t("person.labels.card_number")}
                required={required}
                labelClassName="lg:justify-start lg:w-[100px]"
              />
            </div>

            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleAppend}
                className="text-action-plus text-xs px-0"
              >
                {t("buttons.add_more")}
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
          {t("buttons.add")}
        </Button>
      )}
    </div>
  );
};

export default FormArrayBankDetails;
