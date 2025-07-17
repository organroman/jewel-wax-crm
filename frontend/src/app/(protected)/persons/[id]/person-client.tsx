"use client";
import { TabOption } from "@/types/shared.types";
import { Country } from "@/types/location.types";

import { ChevronLeftIcon, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { usePerson } from "@/api/person/use-person";
import { useLocation } from "@/api/locations/use-location";

import { useDialog } from "@/hooks/use-dialog";

import CustomTabs from "@/components/shared/custom-tabs";
import PersonForm from "@/components/persons/person-form";
import CountryForm from "@/components/persons/location/country-form";
import CityForm from "@/components/persons/location/city-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";
import PersonChangesHistory from "@/components/persons/person-changes-history";

const PersonClient = ({ id }: { id: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );
  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useLocation.getCountries();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen,
    closeDialog,
  } = useDialog();

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

  const handleSuccess = () => {
    closeDialog();
    router.replace("/persons");
  };

  const { updateMutation } = usePerson.updatePerson({ queryClient, t });

  const { deletePersonMutation } = usePerson.deletePerson({
    queryClient,
    handleSuccess,
    t,
  });

  const tabParam = searchParams.get("tab");

  const tabs = translateKeyValueList(
    PERSON_CARD_TABS_LIST,
    t,
    "person.tabs"
  ).filter((tab) => tab.value !== "new");

  const currentTab = tabs.find((t) => t.value === tabParam);

  const [selectedTab, setSelectedTab] = useState<TabOption>(
    currentTab || tabs[0]
  );

  const handleChange = (value: string) => {
    if (selectedTab.value === value) return;

    const selected = tabs.find((t) => t.value === value);
    if (!selected) {
      return;
    }

    setSelectedTab(selected);
  };
  const {
    data: person,
    isLoading,
    error,
  } = usePerson.getPersonById({ id, enabled: id ? true : false });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !person) {
    return <p>{error?.message || "person not found"}</p>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Button
        onClick={() => router.back()}
        variant="link"
        className=" w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> {t("buttons.back_to_table")}
      </Button>
      <CustomTabs
        selectedTab={selectedTab}
        handleChange={handleChange}
        tabsOptions={tabs}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 h-full flex flex-1 flex-col overflow-hidden">
        {selectedTab.value === "general_info" && (
          <PersonForm
            person={person}
            mutation={updateMutation}
            deletePersonMutation={deletePersonMutation}
            isDialogOpen={isDeleteDialogOpen}
            setIsDialogOpen={setDialogOpen}
            countries={countries || []}
            onCreateCity={onCreateCity}
            onCreateCountry={onCreateCountry}
          />
        )}
        {selectedTab.value === "changes_history" && (
          <PersonChangesHistory
            id={id}
            lastName={person.last_name}
            firstName={person.first_name}
            patronymic={person.patronymic}
          />
        )}
      </div>
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
  );
};

export default PersonClient;
