"use client";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { usePerson } from "@/api/persons/use-person";

import PersonForm from "@/components/persons/person-form";
import CustomTabs from "@/components/shared/custom-tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PERSON_CARD_NEW_TAB } from "@/constants/persons.constants";

const NewPersonClient = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { createPersonMutation } = usePerson.createPerson({
    queryClient,
    handleOnSuccess(data) {
      router.push(`${data.id}`);
    },
  });

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
        selectedTab={PERSON_CARD_NEW_TAB[0]}
        tabsOptions={PERSON_CARD_NEW_TAB}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 flex-1 overflow-y-hidden">
        <PersonForm mutation={createPersonMutation} />;
      </div>
    </div>
  );
};

export default NewPersonClient;
