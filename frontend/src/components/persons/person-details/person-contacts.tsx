import CustomAvatar from "@/components/shared/custom-avatar";
import { Badge } from "@/components/ui/badge";
import { PersonContact } from "@/types/person.types";

interface PersonContactsProps {
  contacts: PersonContact[];
}

const PersonContacts = ({ contacts }: PersonContactsProps) => {
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
            className="py-3.5 px-5 bg-ui-row border-ui-border rounded-md flex gap-5 items-center w-full"
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <p className="text-[10px] text-text-muted ">Тип контакта:</p>
                <Badge className="text-accent-red bg-accent-pink text-[10px] rounded-md">
                  Представник
                </Badge>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-[10px] text-text-muted">ПІБ:</p>
                <p className="text-sm font-medium"> {contact.full_name}</p>
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
