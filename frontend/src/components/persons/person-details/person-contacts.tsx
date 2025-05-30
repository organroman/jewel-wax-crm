import { PersonContact } from "@/types/person.types";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

import CustomAvatar from "@/components/shared/custom-avatar";
import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

interface PersonContactsProps {
  contacts: PersonContact[];
}

const PersonContacts = ({ contacts }: PersonContactsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mt-2.5 flex flex-col">
      {contacts.map((contact) => {
        const fullNameArr = contact.full_name?.split(" ");
        const initials = fullNameArr?.map((item) =>
          item.charAt(0).toUpperCase()
        );
        const initialsStr = initials?.join("");

        return (
          <div
            key={contact.id}
            className="py-3.5 px-5 bg-ui-row-even border-ui-border rounded-md flex justify-between lg:justify-start lg:gap-5 items-center w-full"
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <InfoLabel className="text-[10px]">
                  {t("person.labels.contact_type")}:
                </InfoLabel>
                <Badge className="text-accent-red bg-accent-pink text-[10px] rounded-md">
                  {t("person.labels.representative")}
                </Badge>
              </div>
              <div className="flex gap-1 items-center">
                <InfoLabel className="text-[10px]">
                  {t("person.labels.full_name")}:
                </InfoLabel>
                <InfoValue className="text-sm"> {contact.full_name}</InfoValue>
              </div>
            </div>
            <CustomAvatar
              className="w-16 h-16"
              avatarUrl={contact.avatar_url}
              fallback={initialsStr || ""}
              fallbackClassName="text-2xl"
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonContacts;
