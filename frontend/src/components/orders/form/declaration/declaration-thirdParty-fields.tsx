import { CreateDeclarationSchema } from "@/types/novaposhta.types";
import { DeliveryType } from "@/types/person.types";
import debounce from "lodash.debounce";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useLocation } from "@/api/locations/use-location";

import FormAsyncCombobox from "@/components/form/form-async-combobox ";
import FormInput from "@/components/form/form-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DELIVERY_TYPE } from "@/constants/enums.constants";

interface DeclarationThirdPartyFieldsProps {
  form: UseFormReturn<CreateDeclarationSchema>;
  thirdPartyDeliveryType: DeliveryType;
  setThirdPartyDeliveryType: Dispatch<SetStateAction<DeliveryType>>;
  isFop: boolean;
}

const DeclarationThirdPartyFields = ({
  form,
  thirdPartyDeliveryType,
  setThirdPartyDeliveryType,
  isFop,
}: DeclarationThirdPartyFieldsProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const { data: cities, isLoading: citiesLoading } =
    useLocation.getCitiesByCountry(`search=${search}`, 1); // countryID = 1, Ukraine

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearch(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const cityOptions = cities?.data
    ? cities?.data.map((c) => ({
        data: c,
        label: c.name,
        value: c.id,
      }))
    : [];

  const selectedCity = form.watch("thirdPartyCity");

  const { data: warehouses, isLoading: warehousesLoading } =
    useLocation.getWareHouses({
      query: `search=${search}&cityRef=${selectedCity?.ref}`,
      enabled: !!selectedCity && thirdPartyDeliveryType === "warehouse",
    });

  const warehouseOptions =
    warehouses?.map((w) => ({
      label: w.np_warehouse,
      value: w.np_warehouse_ref,
      data: w,
    })) || [];

  const onCityChange = () => {
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-1.5 mt-2.5">
      <div className="flex flex-col lg:flex-row lg:gap-5">
        <FormInput
          name="thirdPartyRecipientName"
          control={form.control}
          label={
            isFop ? t("order.labels.fop") : t("order.labels.recipient_name")
          }
          labelPosition="top"
          isFullWidth
        />

        {!isFop && (
          <FormInput
            name="thirdPartyRecipientSurname"
            control={form.control}
            label={t("order.labels.recipient_surname")}
            labelPosition="top"
            isFullWidth
          />
        )}
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:gap-5">
        <FormInput
          name="thirdPartyRecipientPhone"
          control={form.control}
          label={t("order.labels.recipient_phone")}
          inputStyles="lg:min-w-[200px]"
          labelPosition="top"
          isFullWidth
        />
        <div className="flex flex-1 flex-col gap-0.5 mt-1.5">
          <Label
            htmlFor="thirdPartyDeliveryType"
            className="text-text-muted text-sm/normal"
          >
            {t("person.labels.delivery_type")}
          </Label>
          <Select
            value={thirdPartyDeliveryType}
            onValueChange={(value) =>
              setThirdPartyDeliveryType(value as DeliveryType)
            }
          >
            <SelectTrigger
              size="sm"
              className="w-full h-8"
              id="thirdPartyDeliveryType"
            >
              <SelectValue placeholder={t("placeholders.choose")} />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_TYPE.map((type) => {
                return (
                  <SelectItem key={type} value={type}>
                    {t(`person.modal.delivery_address.delivery_type.${type}`)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <FormAsyncCombobox
          name="thirdPartyCity"
          options={cityOptions}
          control={form.control}
          label={t("location.labels.city")}
          displayKey="name"
          valueKey="id"
          searchQuery={search}
          saveFullObject
          setSearchQuery={setSearch}
          isOptionsLoading={citiesLoading}
          labelPosition="top"
          className="lg:min-w-[180px]"
          onChange={onCityChange}
          popoverContentClassName="min-w-[180px] max-w-[240px]"
        />
      </div>

      {thirdPartyDeliveryType === "warehouse" && (
        <FormAsyncCombobox
          label={t("location.labels.warehouse")}
          name="thirdPartyWarehouse"
          control={form.control}
          options={warehouseOptions}
          isOptionsLoading={warehousesLoading}
          displayKey="np_warehouse"
          valueKey="np_warehouse_ref"
          disabled={!selectedCity}
          searchQuery={inputValue}
          setSearchQuery={(val: string) => handleInputChange(val)}
          labelPosition="top"
          className="lg:min-w-full lg:max-w-full"
          popoverContentClassName="min-w-[470px] max-w-[470px]"
          saveFullObject
        />
      )}
      {thirdPartyDeliveryType === "door" && (
        <div className="flex flex-col lg:flex-row gap-5">
          <FormInput
            name="thirdPartyStreet"
            control={form.control}
            label={t("location.labels.street")}
            inputStyles="lg:min-w-[240px]"
            labelPosition="top"
            isFullWidth
          />
          <FormInput
            name="thirdPartyHouse"
            control={form.control}
            label={t("location.labels.house_number")}
            inputStyles="lg:min-w-[80px]"
            labelPosition="top"
          />
          <FormInput
            name="thirdPartyFlat"
            control={form.control}
            label={t("location.labels.flat_number")}
            inputStyles="lg:min-w-[80px]"
            labelPosition="top"
          />
        </div>
      )}
    </div>
  );
};

export default DeclarationThirdPartyFields;
