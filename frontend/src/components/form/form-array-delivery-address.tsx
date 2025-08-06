import { City, Street, Warehouse } from "@/types/location.types";
import { FormArrayDeliveryAddressProps } from "@/types/form.types";
import { DeliveryAddress, DeliveryType } from "@/types/person.types";

import { FieldValues, Path, PathValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Trash2 } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@components/ui/switch";

import Modal from "@/components/shared/modal/modal";
import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import AsyncCombobox from "@/components/shared/async-combobox";

import { useDialog } from "@/hooks/use-dialog";
import { useLocation } from "@/api/locations/use-location";

import { DELIVERY_TYPE } from "@/constants/enums.constants";

import { getDoorAddress } from "@/lib/utils";

const FormArrayDeliveryAddress = <T extends FieldValues>({
  name,
  control,
  personLocations,
  setValue,
}: FormArrayDeliveryAddressProps<T>) => {
  const { t } = useTranslation();
  const { dialogOpen, setDialogOpen } = useDialog();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("warehouse");
  const [street, setStreet] = useState<Street | null>(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [flatNumber, setFlatNumber] = useState("");

  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const cityIds = personLocations.map((c) => c.id).filter(Boolean);
  const cityIdsQuery = cityIds.map((i) => `ids=${i}`).toString();
  const { data: cities, isLoading: isLoadingCities } = useLocation.getCities({
    query: `ids=${cityIds}`,
    enabled: Boolean(cityIdsQuery) && dialogOpen,
  });

  useEffect(() => {
    const mainCity = cities?.data.find((city) =>
      personLocations.some((ps) => ps.id === city.id && ps.is_main)
    );

    if (mainCity) {
      setSelectedCity(mainCity);
    }
  }, [cities, personLocations]);

  const { data: warehouses, isLoading: isLoadingWarehouses } =
    useLocation.getWareHouses({
      query: `search=${searchQuery}&cityRef=${selectedCity?.ref}`,
      enabled: !!selectedCity && dialogOpen && deliveryType === "warehouse",
    });

  const { data: streets, isLoading: isLoadingStreets } = useLocation.getStreets(
    {
      cityRef: selectedCity?.ref,
      enabled: Boolean(selectedCity?.ref) && dialogOpen,
      query: `streetName=${searchQuery}`,
    }
  );

  const cityOptions = cities?.data.map((c) => ({
    label: c.name,
    value: c.id.toString(),
    data: c,
  }));
  const warehouseOptions =
    warehouses?.map((w) => ({
      label: w.np_warehouse,
      value: w.np_warehouse_ref,
      data: w,
    })) || [];

  const handleAddAddress = () => {
    if (!selectedCity) return;
    const newAddress: Partial<DeliveryAddress> = {
      type: deliveryType,
      is_main: fields.length === 0,
      city_id: selectedCity.id,
    };

    if (deliveryType === "warehouse") {
      if (!selectedWarehouse) return;
      newAddress.np_warehouse_ref = selectedWarehouse.np_warehouse_ref;
      newAddress.np_warehouse = selectedWarehouse.np_warehouse;
      newAddress.np_warehouse_siteKey = selectedWarehouse.np_warehouse_siteKey;
    } else {
      if (!street || !houseNumber) return;
      newAddress.street = street.street;
      newAddress.street_ref = street.street_ref;
      newAddress.house_number = houseNumber;
      newAddress.flat_number = flatNumber;
    }

    append(newAddress as any);
    setDialogOpen(false);
    onCityChange(null);
    setSelectedWarehouse(null);
    setStreet(null);
    setHouseNumber("");
    setFlatNumber("");
    setDeliveryType("warehouse");
  };

  const onCityChange = (opt: City | null) => {
    setSelectedCity(opt);
    setSearchQuery("");
  };

  const onWarehouseChange = (opt: Warehouse | null) => {
    setSelectedWarehouse(opt);
    setSearchQuery("");
  };

  const onStreetChange = (opt: Street | null) => {
    setStreet(opt);
    setSearchQuery("");
  };

  const handleToggleMain = (index: number) => {
    fields.forEach((_, i) => {
      setValue(
        `${name}.${i}.is_main` as Path<T>,
        (i === index) as PathValue<T, any>,
        { shouldDirty: true }
      );
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, index) => {
        const isMain = watchedFields?.[index]?.is_main ?? false;
        const current = watchedFields?.[index];
        const label =
          current?.type === "door"
            ? getDoorAddress(
                current?.street,
                current?.house_number,
                current?.flat_number
              )
            : `${current?.np_warehouse || ""}`;
        return (
          <div
            key={field.id}
            className="w-full flex lg:w-fit flex-col items-start lg:flex-row lg:items-end justify-start gap-3"
          >
            <div className="flex flex-row items-center lg:gap-2.5 lg:items-end">
              <div className="flex flex-col gap-1 w-[240px] lg:w-full">
                <InfoLabel>{t("person.delivery_address")}</InfoLabel>
                <InfoValue className="text-sm">{label}</InfoValue>
              </div>
              <div className="flex mb-0 lg:mb-1.5 items-center gap-2">
                <Switch
                  checked={isMain}
                  onCheckedChange={() => handleToggleMain(index)}
                  id="is_main"
                />
                <Label htmlFor="is_main" className="hidden lg:block text-xs">
                  {t("labels.main")}
                </Label>
                <Label htmlFor="is_main" className="block lg:hidden text-xs">
                  {t("labels.main_short")}
                </Label>
              </div>
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
                className="text-action-plus text-xs h-8 px-0 lg:self-end "
                onClick={() => setDialogOpen(true)}
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
          onClick={() => setDialogOpen(true)}
          className="text-action-plus text-xs px-0 self-start"
        >
          {t("buttons.add")}
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Modal
          header={{
            title: t("person.modal.delivery_address.title"),
            descriptionFirst: t("person.modal.delivery_address.desc_first"),
          }}
          footer={{
            buttonActionTitle: t("buttons.add"),
            buttonActionTitleContinuous: t("buttons.add_continuous"),
            action: handleAddAddress,
          }}
        >
          <div className="flex flex-col gap-2.5">
            <Label>{t("person.labels.delivery_type")}</Label>
            <Select
              onValueChange={(value) => setDeliveryType(value as DeliveryType)}
              defaultValue={deliveryType}
            >
              <SelectTrigger className="pr-2 w-full text-text-muted hover:text-text-regular cursor-pointer bg-ui-sidebar focus-visible:border-none">
                <SelectValue className="pr-0" />
              </SelectTrigger>
              <SelectContent className="min-w-fit">
                {DELIVERY_TYPE.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="w-full focus-visible:border-0"
                  >
                    {t(`person.modal.delivery_address.delivery_type.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AsyncCombobox
              label={t("location.labels.city")}
              options={cityOptions ?? []}
              value={
                selectedCity
                  ? {
                      label: selectedCity.name,
                      value: selectedCity.id.toString(),
                      data: selectedCity,
                    }
                  : null
              }
              onChange={(opt) => onCityChange(opt?.data ?? null)}
              displayKey="name"
              valueKey="id"
              search={searchQuery}
              setSearch={setSearchQuery}
              className="min-w-full"
              popoverContentClassName="min-w-[470px] max-w-[470px]"
              isLoading={isLoadingCities}
            />

            {deliveryType === "warehouse" && (
              <AsyncCombobox
                label={t("location.labels.warehouse")}
                options={warehouseOptions}
                value={
                  selectedWarehouse
                    ? {
                        label: selectedWarehouse.np_warehouse,
                        value: selectedWarehouse.np_warehouse_ref,
                        data: selectedWarehouse,
                      }
                    : null
                }
                onChange={(opt) => onWarehouseChange(opt?.data ?? null)}
                displayKey="np_warehouse"
                valueKey="np_warehouse_ref"
                disabled={!selectedCity}
                search={inputValue}
                setSearch={(val: string) => handleInputChange(val)}
                className="min-w-full"
                popoverContentClassName="min-w-[470px] max-w-[470px]"
                isLoading={isLoadingWarehouses}
              />
            )}

            {deliveryType === "door" && (
              <>
                <AsyncCombobox
                  label={t("location.labels.street")}
                  value={
                    street
                      ? {
                          label: street.street,
                          value: street.street_ref,
                          data: street,
                        }
                      : null
                  }
                  onChange={(opt) => onStreetChange(opt?.data || null)}
                  displayKey="street"
                  valueKey="street_ref"
                  search={searchQuery}
                  setSearch={setSearchQuery}
                  options={
                    streets?.length
                      ? streets.map((s) => ({
                          label: s.street,
                          value: s.street_ref,
                          data: s,
                        }))
                      : []
                  }
                  className="min-w-full"
                  isLoading={isLoadingStreets}
                  popoverContentClassName="min-w-[470px] max-w-[470px]"
                />
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="house">
                    {t("location.labels.house_number")}
                  </Label>
                  <Input
                    id="house"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder={t("location.placeholders.house_number")}
                    className="bg-ui-sidebar rounded-xs"
                  />
                </div>
                <Label htmlFor="flat">{t("location.labels.flat_number")}</Label>
                <Input
                  id="flat"
                  value={flatNumber}
                  placeholder={t("location.placeholders.flat_number")}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="bg-ui-sidebar rounded-xs"
                />
              </>
            )}
          </div>
        </Modal>
      </Dialog>
    </div>
  );
};

export default FormArrayDeliveryAddress;
