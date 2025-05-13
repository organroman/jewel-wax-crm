import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

        return (
          <div
            key={contact.id}
            className="py-3.5 px-5 bg-ui-row border-ui-border rounded-md flex justify-between items-center"
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
            <Avatar className="w-16 h-16">
              <AvatarImage src={contact.avatar_url} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
        );
      })}
    </div>
  );
};

export default PersonContacts;
