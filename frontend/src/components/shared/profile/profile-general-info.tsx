import { Person } from "@/types/person.types";
import { useTranslation } from "react-i18next";
import { SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePerson } from "@/api/person/use-person";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import InfoValue from "../typography/info-value";

interface ProfileGeneralInfoProps {
  person: Person;
}

const ProfileGeneralInfo = ({ person }: ProfileGeneralInfoProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState<string>(person.first_name);
  const [lastName, setLastName] = useState<string>(person.last_name);
  const [patronymic, setPatronymic] = useState<string>(person.patronymic);

  const hasChanges =
    firstName !== person.first_name ||
    lastName !== person.last_name ||
    patronymic !== person.patronymic;

  const hasPermissionToEdit = person.role === "super_admin";

  const { updateUserMutation } = usePerson.updateUser({ t, queryClient });

  const handleUpdateGeneralInfo = () => {
    updateUserMutation.mutate({
      id: person.id,
      first_name: firstName,
      last_name: lastName,
      patronymic: patronymic,
      avatar_url: person.avatar_url,
    });
  };

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <InfoValue className="text-md font-medium">
          {t("person.labels.general_info")}
        </InfoValue>
        {hasPermissionToEdit && (
          <Button
            variant="ghost"
            disabled={!hasChanges}
            onClick={handleUpdateGeneralInfo}
            className="h-[24px] w-[24px] flex items-center p-0 text-ui-white hover:bg-transparent hover:text-ui-white cursor-pointer "
          >
            <SquarePenIcon className="size-5 stroke-1" />
          </Button>
        )}
      </div>
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5 mb-5 mt-2.5" />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row gap-5 items-center justify-end ">
          <Label htmlFor="firstName">{t("person.labels.first_name")}:</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
          />
        </div>
        <div className="w-full flex flex-row gap-5 items-center justify-end">
          <Label htmlFor="lastName">{t("person.labels.last_name")}:</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
          />
        </div>
        <div className="flex flex-row gap-5 items-center justify-end">
          <Label htmlFor="patronymic" className="text-nowrap">
            {t("person.labels.patronymic")}:
          </Label>
          <Input
            id="patronymic"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileGeneralInfo;
