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
import FormPhoneInput from "./form-phone-input";
import { Label } from "../ui/label";
import { PersonMessenger } from "@/types/person.types";
import InfoLabel from "../shared/typography/info-label";
import { getMessengerIcon } from "@/lib/utils";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface FormArrayPhoneProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fieldKey?: string; // default is "value"
  showIsMain?: boolean;
  messengers?: PersonMessenger[];
}

const FormArrayPhone = <T extends FieldValues>({
  name,
  control,
  setValue,
  label,
  placeholder,
  required = false,
  fieldKey = "value",
  showIsMain = false,
  messengers,
}: FormArrayPhoneProps<T>) => {
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
    <div className="space-y-4">
      {/* {label && <p className="text-sm font-medium mb-1">{label}</p>} */}

      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;
        const phoneMessengers = messengers?.filter(
          (m) => watchedFields?.[index]?.id === m.phone_id
        );

        return (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex flex-col">
              <FormPhoneInput
                control={control}
                name={`${name}.${index}.${fieldKey}` as Path<T>}
                // placeholder={placeholder}
                label={label}
                required={required && index === 0}
              />
              <div className="flex mt-1.5 gap-2.5">
                <InfoLabel className="text-sm w-[124px]">Месенджери:</InfoLabel>
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
            </div>
            {showIsMain && (
              <div className="flex items-center gap-2 mt-1.5">
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

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-text-light hover:text-action-minus"
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
        className="text-action-plus text-xs p-0"
        onClick={handleAppend}
      >
        Додати ще
      </Button>
    </div>
  );
};

export default FormArrayPhone;
