import { FormArrayInputProps } from "@/types/form.types";

import { useEffect, useRef } from "react";
import {
  FieldValues,
  get,
  Path,
  PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import FormArrayInputItem from "./form-array-input-item";
import { cn } from "@/lib/utils";

const FormArrayInput = <T extends FieldValues>({
  name,
  control,
  setValue,
  label,
  placeholder,
  required = false,
  fieldKey = "value",
  showIsMain = false,
  inputClassName,
  errors,
}: FormArrayInputProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });
  const hasAppended = useRef(false);
  const { t } = useTranslation();

  const handleToggleMain = (index: number) => {
    fields.forEach((_, i) => {
      setValue(
        `${name}.${i}.is_main` as any,
        (i === index) as PathValue<T, any>
      );
    });
  };
  useEffect(() => {
    const noData = (!watchedFields || watchedFields.length === 0) && required;

    if (!hasAppended.current && fields.length === 0 && noData) {
      append({ [fieldKey]: "", is_main: true } as any);
      hasAppended.current = true;
    }
  }, [append, fields.length, watchedFields, fieldKey]);

  const handleAppend = () => {
    append({
      [fieldKey]: "",
      is_main: !watchedFields || watchedFields.length === 0 ? true : false,
    } as any);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;

        const inputName = `${name}.${index}.${fieldKey}` as Path<T>;
        const hasError = !!get(errors, inputName);
        return (
          <div
            key={field.id}
            className="flex flex-col lg:flex-row lg:items-center gap-2.5"
          >
            <div
              className={cn(
                "flex  lg:items-center gap-2.5",
                hasError ? "items-center" : "items-end"
              )}
            >
              <FormArrayInputItem
                key={field.id}
                name={inputName}
                control={control}
                label={label}
                placeholder={placeholder}
                required={required && index === 0}
                inputClassName={inputClassName}
              />

              {showIsMain && (
                <div className="flex lg:self-start items-center h-8 gap-2">
                  <Switch
                    checked={isMain}
                    onCheckedChange={() => handleToggleMain(index)}
                  />
                  <Label className="text-xs">{t("labels.main")}</Label>
                </div>
              )}
              <Button
                type="button"
                variant="ghostDestructive"
                size="icon"
                className="h-8 lg:self-start"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                // size="sm"
                className="text-action-plus text-xs h-8 px-0 self-start "
                onClick={handleAppend}
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
          // size="sm"
          className="text-action-plus text-xs px-0 self-start"
          onClick={handleAppend}
        >
          {t("buttons.add")}
        </Button>
      )}
    </div>
  );
};

export default FormArrayInput;
