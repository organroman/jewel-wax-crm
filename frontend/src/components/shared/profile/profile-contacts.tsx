import { Option } from "@/types/form.types";
import { useEffect, useMemo, useState } from "react";
import { Email, Person, Phone, Location } from "@/types/person.types";
import { SquarePenIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { useQueryClient } from "@tanstack/react-query";

import { useLocation } from "@/api/locations/use-location";
import { usePerson } from "@/api/person/use-person";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import InfoValue from "../typography/info-value";
import AsyncCombobox from "../async-combobox";

interface ProfileContactsProps {
  person: Person;
}

const ProfileContacts = ({ person }: ProfileContactsProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mainPhone = person.phones.find((p) => p.is_main) ?? person.phones[0];
  const mainEmail = person.emails.find((e) => e.is_main) ?? person.emails[0];
  const mainLocation =
    person.locations.find((l) => l.is_main) ?? person.locations[0];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const { updateUserMutation } = usePerson.updateUser({ t, queryClient });

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const { data: countries = [] } = useLocation.getCountries();

  const ukraineId = countries?.find((c) => c.name === "Україна")?.id || 1;

  const { data: cities, isLoading } = useLocation.getCitiesByCountry(
    `search=${searchQuery}`,
    ukraineId
  );

  const existingCityInOptions = cities?.data.find(
    (c) => c.id === mainLocation.city_id
  );

  const citiesToLocations =
    cities?.data.map((c) => ({
      id: mainLocation.id,
      is_main: mainLocation.is_main,
      country_id: mainLocation.country_id,
      country_name: mainLocation.country_name,
      city_id: c.id,
      city_name: c.name,
    })) || [];

  const fullCitiesList: Location[] = existingCityInOptions
    ? citiesToLocations
    : [...citiesToLocations, mainLocation];

  const [phone, setPhone] = useState<Phone | null>(mainPhone);
  const [email, setEmail] = useState<Email | null>(mainEmail);
  const [location, setLocation] = useState<Option<Location> | null>({
    data: mainLocation,
    label: mainLocation.city_name,
    value: mainLocation.city_id,
  });

  const handleChangePhone = (value: string) => {
    setPhone({
      ...phone,
      number: value,
      is_main: mainPhone ? mainPhone.is_main : false,
    });
  };

  const handleChangeEmail = (value: string) => {
    setEmail({
      ...email,
      person_id: person.id,
      email: value,
      is_main: mainEmail ? mainEmail.is_main : false,
    });
  };

  const handleChangeCity = (value: Option<Location> | null) => {
    setLocation(value);
  };

  const hasChanges =
    email?.email !== mainEmail.email ||
    phone?.number !== mainPhone.number ||
    location?.data?.city_name !== mainLocation.city_name;

  const hasPermissionToEdit = person.role === "super_admin";

  const handleUpdateContacts = () => {
    updateUserMutation.mutate({
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      patronymic: person.patronymic,
      avatar_url: person.avatar_url,
      phone: phone,
      email: email,
      location: location?.data,
    });
  };

  return (
    <div>
      <div className="w-full flex flex-row mt-9 items-center justify-between">
        <InfoValue className="text-md font-medium">
          {t("person.labels.contacts")}
        </InfoValue>
        <Button
          variant="ghost"
          disabled={!hasChanges}
          onClick={handleUpdateContacts}
          className="h-[24px] w-[24px] flex items-center p-0 text-ui-white hover:bg-transparent hover:text-ui-white cursor-pointer "
        >
          <SquarePenIcon className="size-5 stroke-1" />
        </Button>
      </div>
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5 mb-5 mt-2.5" />
      <div className="flex flex-col gap-2.5">
        <AsyncCombobox
          options={fullCitiesList.map((c) => ({
            data: c,
            label: c.city_name,
            value: c.city_id,
          }))}
          displayKey="city_name"
          value={location}
          valueKey="city_id"
          label={`${t("person.labels.address")}:`}
          search={inputValue}
          setSearch={(val: string) => handleInputChange(val)}
          onChange={(data) => handleChangeCity(data ?? null)}
          isLoading={isLoading}
          triggerHeight="h-8"
          popoverContentClassName="min-w-[240px] max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-sm"
          labelPosition="left"
          className="gap-5 justify-end"
          disabled={!hasPermissionToEdit}
        />

        <div className="flex flex-row gap-5 items-center justify-end ">
          <Label htmlFor="phone">{t("person.labels.phone")}:</Label>
          <Input
            id="phone"
            value={phone?.number ?? ""}
            onChange={(e) => handleChangePhone(e.target.value)}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
            disabled={!hasPermissionToEdit}
          />
        </div>
        <div className="flex flex-row gap-5 items-center justify-end ">
          <Label htmlFor="email">{t("person.labels.email")}:</Label>
          <Input
            id="email"
            value={email?.email ?? ""}
            onChange={(e) => handleChangeEmail(e.target.value)}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
            disabled={!hasPermissionToEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContacts;
