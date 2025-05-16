import { Country, City } from "@/types/location.types";
import { Location } from "@/types/person.types";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  ArrayPath,
  Control,
  FieldValues,
  Path,
  useFieldArray,
  useWatch,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { Trash2 } from "lucide-react";


import { useLocation } from "@/api/locations/use-location";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormLabel } from "../ui/form";


import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface FormArrayLocationProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  countries: Country[];
  onCreateCountry?: () => void;
  onCreateCity?: (countryId: number) => void;
}

const FormArrayLocation = <T extends FieldValues>({
  name,
  control,
  setValue,
  countries,
  onCreateCountry,
  onCreateCity,
}: FormArrayLocationProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });

  // 👇 build list of countryIds per index (memoized)
  const countryIds = useMemo(
    () =>
      (watchedFields as Location[])?.map(
        (row: { country_id?: number }) => row?.country_id
      ) || [],
    [watchedFields]
  );

  // 👇 batch queries for each selected country
  const cityQueries = useQueries({
    queries: countryIds.map((countryId) =>
      useLocation.getCitiesByCountryQuery(countryId)
    ),
  });

  const handleAppend = () => {
    append({
      country_id: "",
      country_name: "",
      city_id: "",
      city_name: "",
    } as any);
  };

  const handleCountryChange = (index: number, countryId: number) => {
    const country = countries.find((c) => c.id === countryId);
    setValue(
      `${name}.${index}.country_id` as any,
      countryId as PathValue<T, any>
    );
    setValue(
      `${name}.${index}.country_name` as any,
      (country?.name || "") as PathValue<T, any>
    );
    setValue(`${name}.${index}.city_id` as any, "" as PathValue<T, any>);
    setValue(`${name}.${index}.city_name` as any, "" as PathValue<T, any>);
  };

  const handleCityChange = (index: number, cityId: number) => {
    const city = cityQueries[index]?.data?.find((c: City) => c.id === cityId);
    setValue(`${name}.${index}.city_id` as any, cityId as PathValue<T, any>);
    setValue(
      `${name}.${index}.city_name` as any,
      (city?.name || "") as PathValue<T, any>
    );
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
        const selectedCityId = watchedFields?.[index]?.city_id;
        const cityOptions = cityQueries[index]?.data || [];
        const isLoading = cityQueries[index]?.isLoading;

        return (
          <div key={field.id} className="flex items-center gap-5">
            {/* Country Select */}
            <div className="flex items-center gap-2.5">
              <FormLabel className=" text-xs">Країна</FormLabel>
              <div className="flex items-center">
                <Select
                  onValueChange={(val) => handleCountryChange(index, +val)}
                  value={selectedCountryId?.toString() || ""}
                >
                  <SelectTrigger
                    className="w-40 rounded-tr-none rounded-br-none"
                    size="sm"
                  >
                    <SelectValue placeholder="Країна" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-tl-none rounded-bl-none"
                  onClick={onCreateCountry}
                >
                  Додати
                </Button>
              </div>
            </div>

            {/* City Select */}
            <div className="flex items-center gap-2.5">
              <FormLabel className=" text-xs">Місто</FormLabel>
              <div className="flex items-center">
                <Select
                  onValueChange={(val) => {
                    handleCityChange(index, +val);
                  }}
                  value={selectedCityId?.toString() || ""}
                  disabled={!selectedCountryId || isLoading}
                >
                  <SelectTrigger className="w-40" size="sm">
                    <SelectValue placeholder="Місто" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((city: City) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-tl-none rounded-bl-none"
                  onClick={() => onCreateCity?.(selectedCountryId)}
                >
                  Додати
                </Button>
              </div>
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
                className="text-action-plus text-xs"
                onClick={handleAppend}
              >
                Додати ще
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormArrayLocation;
