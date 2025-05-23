import { FormArrayPhoneProps } from "@/types/form.types";

import {
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import InfoLabel from "@components/shared/typography/info-label";

import FormPhoneInput from "./form-phone-input";

import { getMessengerIcon } from "@/lib/utils";

const FormArrayPhone = <T extends FieldValues>({
  name,
  control,
  setValue,
  label,
  required = false,
  fieldKey = "value",
  showIsMain = false,
  messengers = [],
}: FormArrayPhoneProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });
  const hasAppended = useRef(false);

  const handleToggleMain = (index: number) => {
    fields.forEach((_, i) => {
      setValue(
        `${name}.${i}.is_main` as any,
        (i === index) as PathValue<T, any>
      );
    });
  };
  useEffect(() => {
    const noData = !watchedFields || watchedFields.length === 0;

    if (!hasAppended.current && fields.length === 0 && noData) {
      append({ [fieldKey]: "", is_main: true } as any);
      hasAppended.current = true;
    }
  }, [append, fields.length, watchedFields, fieldKey]);

  const handleAppend = () => {
    append({ [fieldKey]: "", is_main: false } as any);
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;
        const phoneMessengers = messengers?.filter(
          (m) => watchedFields?.[index]?.id === m.phone_id
        );

        return (
          <div key={field.id} className="flex lg:items-start gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <FormPhoneInput
                  control={control}
                  name={`${name}.${index}.${fieldKey}` as Path<T>}
                  label={label}
                  required={required && index === 0}
                />
                {showIsMain && (
                  <div className="flex items-center gap-2 mt-5 lg:mt-0">
                    <Switch
                      id={`${name}.${index}`}
                      checked={isMain}
                      onCheckedChange={() => handleToggleMain(index)}
                    />
                    <Label
                      htmlFor={`${name}.${index}`}
                      className="text-xs text-text-muted font-normal"
                    >
                      Основний
                    </Label>
                  </div>
                )}
              </div>

              {phoneMessengers?.length > 0 && (
                <div className="flex mt-1.5 gap-2.5">
                  <InfoLabel className="text-sm w-[124px]">
                    Месенджери:
                  </InfoLabel>
                  <div className="flex items-center gap-1">
                    {phoneMessengers?.map((m) => {
                      const icon = getMessengerIcon(m.platform);
                      return icon ? (
                        <Image
                          key={m.id}
                          src={icon}
                          alt={m.platform}
                          width={20}
                          height={20}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* {showIsMain && (
              <div className="flex items-center gap-2 mt-5 lg:mt-1.5">
                <Switch
                  id={`${name}.${index}`}
                  checked={isMain}
                  onCheckedChange={() => handleToggleMain(index)}
                />
                <Label
                  htmlFor={`${name}.${index}`}
                  className="text-xs text-text-muted font-normal"
                >
                  Основний
                </Label>
              </div>
            )} */}

            <Button
              type="button"
              variant="ghostDestructive"
              size="sm"
              onClick={() => remove(index)}
              className="mt-5 lg:mt-0"
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
        className="text-action-plus text-xs p-0"
        onClick={handleAppend}
      >
        {fields.length === 0 ? "Додати" : "Додати ще"}
      </Button>
    </div>
  );
};

export default FormArrayPhone;
