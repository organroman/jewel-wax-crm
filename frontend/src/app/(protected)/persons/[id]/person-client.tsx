"use client";

import { ChevronLeftIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { usePerson } from "@/api/persons/use-person";
import CustomTabs from "@/components/shared/custom-tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";

const PersonClient = ({ id }: { id: number; enabled: boolean }) => {
  const router = useRouter();
  const {
    data: person,
    isLoading,
    error,
  } = usePerson.getPersonById({ id, enabled: true });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !person) {
    return <p>{error?.message || "person not found"}</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <Button
        onClick={() => router.back()}
        variant="link"
        className="w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> Повернутись до таблиці
      </Button>
      <CustomTabs isModal={false} tabsOptions={PERSON_CARD_TABS_LIST} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      {/* <div className="mt-6 flex-1">
        <PersonDetails person={person} />
      </div> */}
    </div>
  );
};

export default PersonClient;
