"use client";
import { Country } from "@/types/location.types";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { usePerson } from "@/api/person/use-person";
import { useLocation } from "@/api/locations/use-location";
import { useDialog } from "@/hooks/use-dialog";

import PersonForm from "@/components/persons/person-form";
import CustomTabs from "@/components/shared/custom-tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";

import CityForm from "@/components/persons/location/city-form";
import CountryForm from "@/components/persons/location/country-form";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";

const NewPersonClient = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const tabs = translateKeyValueList(
    PERSON_CARD_TABS_LIST,
    t,
    "person.tabs"
  ).filter((tab) => tab.value === "new");

  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );

  const { createPersonMutation } = usePerson.createPerson({
    queryClient,
    handleOnSuccess(data) {
      router.replace(`${data.id}`);
    },
    t,
  });

  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useLocation.getCountries();

  const {
    dialogOpen: createCityDialogOpen,
    setDialogOpen: createCitySetDialogOpen,
  } = useDialog();

  const {
    dialogOpen: createCountryDialogOpen,
    setDialogOpen: createCountrySetDialogOpen,
  } = useDialog();

  const onCreateCity = (countryId: number) => {
    if (countryId) {
      const country = countries?.find((c) => c.id === countryId);

      setSelectedCountry(country);
    }
    createCitySetDialogOpen(true);
  };

  const onCreateCountry = () => {
    createCountrySetDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-1 flex-col overflow-y-hidden">
      <Button
        onClick={() => router.back()}
        variant="link"
        className="w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> {t("buttons.back_to_table")}
      </Button>
      <CustomTabs selectedTab={tabs[0]} tabsOptions={tabs} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 flex-1 overflow-y-hidden">
        <PersonForm
          mutation={createPersonMutation}
          countries={countries || []}
          onCreateCity={onCreateCity}
          onCreateCountry={onCreateCountry}
        />
        <Dialog
          open={createCityDialogOpen}
          onOpenChange={createCitySetDialogOpen}
        >
          <CityForm
            countries={countries || []}
            setIsDialogOpen={createCitySetDialogOpen}
            country={selectedCountry}
          />
        </Dialog>
        <Dialog
          open={createCountryDialogOpen}
          onOpenChange={createCountrySetDialogOpen}
        >
          <CountryForm setIsDialogOpen={createCountrySetDialogOpen} />
        </Dialog>
      </div>
    </div>
  );
};

export default NewPersonClient;
