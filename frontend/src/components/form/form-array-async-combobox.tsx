"use client";
import { FormArrayComboboxProps } from "@/types/form.types";

import { FieldValues, Path, useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import FormAsyncCombobox from "./form-async-combobox ";

const FormArrayAsyncCombobox = <T extends FieldValues, O>({
  name,
  control,
  label,
  placeholder,
  required = false,
  options,
  fieldKey = "value",
  displayKey,
  valueKey,
  saveFullObject,
  isShownEmptyInput = false,
  searchQuery,
  setSearchQuery,
  isOptionsLoading,
}: FormArrayComboboxProps<T, O>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const hasAppended = useRef(false);

  useEffect(() => {
    if (!hasAppended.current && fields.length === 0 && isShownEmptyInput) {
      append({ [fieldKey]: "" } as any);
      hasAppended.current = true;
    }
  }, [fields.length, append, fieldKey, isShownEmptyInput]);

  const handleAppend = () => {
    append(saveFullObject ? ({} as any) : ({ [fieldKey]: "" } as any));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {fields.map((field, index) => {
        const inputName = (
          saveFullObject ? `${name}.${index}` : `${name}.${index}.${fieldKey}`
        ) as Path<T>;

        return (
          <div key={field.id} className="flex flex-col lg:flex-row w-full items-start lg:items-center gap-2.5">
            <div className="flex items-end gap-2.5">
              <FormAsyncCombobox
                name={inputName}
                control={control}
                placeholder={placeholder}
                options={options}
                label={label}
                required={required && index === 0}
                displayKey={displayKey}
                valueKey={valueKey}
                saveFullObject={saveFullObject}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOptionsLoading={isOptionsLoading}
              />
              <Button
                type="button"
                variant="ghostDestructive"
                size="icon"
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
                className="text-action-plus text-xs p-0"
                onClick={handleAppend}
              >
                {fields.length === 0 ? "Додати" : "Додати ще"}
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
          className="text-action-plus text-xs p-0 self-start"
          onClick={handleAppend}
        >
          {fields.length === 0 ? "Додати" : "Додати ще"}
        </Button>
      )}
    </div>
  );
};

export default FormArrayAsyncCombobox;
