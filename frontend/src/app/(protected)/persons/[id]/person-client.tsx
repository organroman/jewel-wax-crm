"use client";
import { TabOption } from "@/types/shared.types";

import { ChevronLeftIcon, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { usePerson } from "@/api/persons/use-person";

import CustomTabs from "@/components/shared/custom-tabs";
import PersonForm from "@/components/persons/person-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";

const PersonClient = ({ id }: { id: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="h-full flex flex-1 flex-col overflow-y-hidden">
      <Button
        onClick={() => router.back()}
        variant="link"
        className="w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> Повернутись до таблиці
      </Button>
      <CustomTabs
        selectedTab={selectedTab}
        handleChange={handleChange}
        tabsOptions={PERSON_CARD_TABS_LIST}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 flex-1 overflow-y-hidden">
        {selectedTab.value === "general_info" && <PersonForm person={person} />}
      </div>
    </div>
  );
};

export default PersonClient;
