import { Location } from "@/types/person.types";
import { FormArrayLocationProps } from "@/types/form.types";

import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  FieldValues,
  Path,
  useFieldArray,
  useWatch,
  PathValue,
  get,
} from "react-hook-form";
import { useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { locationService } from "@/api/locations/location-service";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import FormCombobox from "./form-combobox";
import FormAsyncCombobox from "./form-async-combobox";

import { cn } from "@/lib/utils";

const FormArrayLocation = <T extends FieldValues>({
  name,
  control,
  setValue,
  countries,
  onCreateCountry,
  onCreateCity,
  required,
  errors,
}: FormArrayLocationProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });
  const hasAppended = useRef(false);
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [, setDebouncedValue] = useState("");

  const debouncedSearchQuery = useMemo(
    () => debounce((value: string) => setDebouncedValue(value), 300),
    []
  );

  const countryIds = useMemo(
    () =>
      (watchedFields as Location[])
        ?.map((row: { country_id?: number }) => row?.country_id)
        .filter((id): id is number => typeof id === "number") || [],
    [watchedFields]
  );

  const cityIds = useMemo(
    () =>
      (watchedFields as Location[])
        ?.map((row: { city_id?: number }) => row?.city_id)
        .filter((id): id is number => typeof id === "number") || [],
    [watchedFields]
  );

  const cityQueries = useQueries({
    queries: countryIds.map((countryId) => ({
      queryKey: ["cities", countryId, search],
      queryFn: () =>
        locationService.getCitiesByCountry(countryId!, `search=${search}`),
      enabled: !!countryId,
    })),
  });

  const existingCitiesQueries = useQueries({
    queries: cityIds.map((cityId) => ({
      queryKey: ["city", cityId],
      queryFn: () => locationService.getCityById(cityId),
      enabled: !!cityId,
    })),
  });

  useEffect(() => {
    debouncedSearchQuery(search);
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [search, debouncedSearchQuery]);

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
        `${name}.${i}.is_main` as any,
        (i === index) as PathValue<T, any>
      );
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;
        const selectedCountryId = watchedFields?.[index]?.country_id;
        const cityOptions = cityQueries[index]?.data?.data || [];
        const isLoading = cityQueries[index]?.isLoading;
        const existingCity = existingCitiesQueries[index]?.data;

        const isExistingInOptions = cityOptions.find(
          (c) => c.id === existingCity?.id
        );

        const fullCities =
          existingCity && !isExistingInOptions
            ? [...cityOptions, existingCity]
            : cityOptions;

        const fullCityOptions = fullCities.map((c) => ({
          ...c,
          city_name: c.name,
          city_id: c.id,
        }));

        const hasCountryError = !!get(errors, `${name}.${index}.country_id`);
        const hasCityError = !!get(errors, `${name}.${index}.city_id`);

        return (
          <div
            key={field.id}
            className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-5"
          >
            <div
              className={cn(
                "flex lg:items-start",
                hasCountryError ? "items-center" : "items-end"
              )}
            >
              <FormCombobox
                name={`${name}.${index}.country_id` as Path<T>}
                label={t("location.labels.country")}
                placeholder={t("location.placeholders.choose_country")}
                control={control}
                options={
                  (countries &&
                    countries.map((c) => ({
                      label: c.name,
                      value: c.id,
                      data: c,
                    }))) ||
                  []
                }
                displayKey="name"
                valueKey="id"
                saveOnlyValue
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="rounded-tl-none rounded-bl-none"
                onClick={onCreateCountry}
              >
                {t("buttons.add")}
              </Button>
            </div>

            <div
              className={cn(
                "flex lg:items-start",
                hasCountryError ? "items-center" : "items-end"
              )}
            >
              <FormAsyncCombobox
                name={`${name}.${index}.city_id` as Path<T>}
                control={control}
                placeholder={t("location.placeholders.choose_city")}
                options={
                  (fullCityOptions &&
                    fullCityOptions.map((c) => ({
                      label: c.city_name || "",
                      value: c.city_id,
                      data: c,
                    }))) ||
                  []
                }
                label={t("location.labels.city")}
                required={required && index === 0}
                displayKey="city_name"
                valueKey="city_id"
                saveOnlyValue
                searchQuery={search}
                setSearchQuery={setSearch}
                isOptionsLoading={isLoading}
                disabled={!selectedCountryId}
                onChange={(selected) => {
                  setValue(
                    `${name}.${index}.city_name` as any,
                    selected?.data?.city_name as PathValue<T, any>
                  );
                }}
                popoverContentClassName="lg:w-[240px]"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="rounded-tl-none rounded-bl-none"
                onClick={() => onCreateCity?.(selectedCountryId)}
              >
                {t("buttons.add")}
              </Button>
              <div
                className={cn(
                  "flex items-center  gap-2 mx-2 lg:mx-4 lg:mb-0 lg:mt-1.5",
                  hasCityError ? "mb-0" : "mb-1.5"
                )}
              >
                <Switch
                  id={`${name}.${index}`}
                  checked={isMain}
                  onCheckedChange={() => handleToggleMain(index)}
                />
                <Label
                  htmlFor={`${name}.${index}`}
                  className="hidden lg:block text-xs text-text-muted font-normal"
                >
                  {t("labels.main")}
                </Label>
                <Label
                  htmlFor={`${name}.${index}`}
                  className="lg:hidden text-xs text-text-muted font-normal"
                >
                  {t("labels.main_short")}
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
            </div>

            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-action-plus text-xs p-0 self-start"
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
          size="sm"
          className="text-action-plus text-xs p-0"
          onClick={handleAppend}
        >
          {t("buttons.add")}
        </Button>
      )}
    </div>
  );
};

export default FormArrayLocation;
