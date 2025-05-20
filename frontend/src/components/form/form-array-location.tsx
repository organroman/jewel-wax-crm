import { Location } from "@/types/person.types";
import { FormArrayLocationProps } from "@/types/form.types";

import { useEffect, useMemo, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  FieldValues,
  Path,
  useFieldArray,
  useWatch,
  PathValue,
} from "react-hook-form";
import { Trash2 } from "lucide-react";

import { useLocation } from "@/api/locations/use-location";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import FormCombobox from "./form-combobox";

const FormArrayLocation = <T extends FieldValues>({
  name,
  control,
  setValue,
  countries,
  onCreateCountry,
  onCreateCity,
  required,
}: FormArrayLocationProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });
  const hasAppended = useRef(false);

  const countryIds = useMemo(
    () =>
      (watchedFields as Location[])?.map(
        (row: { country_id?: number }) => row?.country_id
      ) || [],
    [watchedFields]
  );

  const cityQueries = useQueries({
    queries: countryIds.map((countryId) =>
      useLocation.getCitiesByCountryQuery(countryId)
    ),
  });

  useEffect(() => {
    const noData = (!watchedFields || watchedFields.length === 0) && required;

    if (!hasAppended.current && fields.length === 0 && noData) {
      append({
        country_id: null,
        country_name: "",
        city_id: null,
        city_name: "",
        is_main: true,
      } as any);
      hasAppended.current = true;
    }
  }, [append, fields.length, watchedFields]);

  const handleAppend = () => {
    append({
      country_id: null,
      country_name: "",
      city_id: null,
      city_name: "",
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
    <div className="space-y-2">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;
        const selectedCountryId = watchedFields?.[index]?.country_id;
        const cityOptions = cityQueries[index]?.data || [];
        const isLoading = cityQueries[index]?.isLoading;

        return (
          <div key={field.id} className="flex items-start gap-5">
            <div className="flex items-start">
              <FormCombobox
                name={`${name}.${index}.country_id` as Path<T>}
                label="Країна"
                placeholder="Оберіть країну"
                control={control}
                options={
                  (countries &&
                    countries.map((c) => ({
                      label: c.name || "",
                      value: c.id,
                      data: c,
                    }))) ||
                  []
                }
                displayKey="name"
                valueKey="id"
                saveOnlyValue={true}
              />
              <Button
                variant="outline"
                size="sm"
                className="rounded-tl-none rounded-bl-none"
                onClick={onCreateCountry}
              >
                Додати
              </Button>
            </div>

            <div className="flex items-start">
              <FormCombobox
                name={`${name}.${index}.city_id` as Path<T>}
                label="Місто"
                placeholder="Оберіть місто"
                control={control}
                options={
                  (cityOptions &&
                    cityOptions.map((c) => ({
                      label: c.name || "",
                      value: c.id,
                      data: c,
                    }))) ||
                  []
                }
                displayKey="name"
                valueKey="id"
                saveOnlyValue={true}
                disabled={!selectedCountryId || isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                className="rounded-tl-none rounded-bl-none"
                onClick={() => onCreateCity?.(selectedCountryId)}
              >
                Додати
              </Button>
            </div>

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

            <Button
              type="button"
              variant="ghostDestructive"
              onClick={() => remove(index)}
              size="sm"
            >
              <Trash2 className="size-4" />
            </Button>

            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-action-plus text-xs p-0"
                onClick={handleAppend}
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
          className="text-action-plus text-xs p-0"
          onClick={handleAppend}
        >
          Додати
        </Button>
      )}
    </div>
  );
};

export default FormArrayLocation;
