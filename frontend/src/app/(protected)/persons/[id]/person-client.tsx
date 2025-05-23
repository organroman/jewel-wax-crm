"use client";
import { TabOption } from "@/types/shared.types";
import { Country } from "@/types/location.types";

import { ChevronLeftIcon, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePerson } from "@/api/persons/use-person";
import { useLocation } from "@/api/locations/use-location";

import CustomTabs from "@/components/shared/custom-tabs";
import PersonForm from "@/components/persons/person-form";
import CountryForm from "@/components/persons/location/country-form";
import CityForm from "@/components/persons/location/city-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { useDialog } from "@/hooks/use-dialog";

const PersonClient = ({ id }: { id: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

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

  const { updateMutation } = usePerson.updatePerson({ queryClient });

  const { deletePersonMutation } = usePerson.deletePerson({
    queryClient,
    handleSuccess,
  });

  const tabParam = searchParams.get("tab");

  const currentTab = PERSON_CARD_TABS_LIST.find((t) => t.value === tabParam);

  const [selectedTab, setSelectedTab] = useState<TabOption>(
    currentTab || PERSON_CARD_TABS_LIST[0]
  );

  const handleChange = (value: string) => {
    if (selectedTab.value === value) return;

    const selected = PERSON_CARD_TABS_LIST.find((t) => t.value === value);
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
        onClick={() => router.push("/persons")}
        variant="link"
        className=" w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> Повернутись до таблиці
      </Button>
      <CustomTabs
        selectedTab={selectedTab}
        handleChange={handleChange}
        tabsOptions={PERSON_CARD_TABS_LIST}
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
