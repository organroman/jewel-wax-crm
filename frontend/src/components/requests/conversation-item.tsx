import { Conversation } from "@/types/request.types";

import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import { Badge } from "../ui/badge";

import CustomAvatar from "../shared/custom-avatar";
import InfoValue from "../shared/typography/info-value";
import InfoLabel from "../shared/typography/info-label";

import { cn, getFullName, getInitials } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  badge?: number;
  userId: number;
}

const ConversationItem = ({
  conversation,
  badge,
  userId,
}: ConversationItemProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("id");

  const { participants } = conversation;

  const opponent = participants.find((p) => p.person?.id !== userId);
  const person = opponent?.person;
  const contact = opponent?.contact;

  const avatarUrl = person ? person.avatar_url : contact?.avatar_url;
  const contactFirstAndLastName = contact?.full_name
    ? contact.full_name.split(" ")
    : [];
  const initials = person
    ? getInitials(person.first_name, person.last_name)
    : contactFirstAndLastName.length > 1
    ? getInitials(contactFirstAndLastName[0], contactFirstAndLastName[1])
    : contact?.full_name?.charAt(0) ?? "";

  const nameLabel = person
    ? getFullName(person.first_name, person.last_name, person.patronymic)
    : contact?.full_name;

  const userNameOrPhoneLabel = person
    ? person.phones?.[0].number
    : contact?.username;

  const handleSelect = (id: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("id", String(id));

    router.replace(`requests?${params.toString()}`);
  };

  const active = conversation.id === Number(current);

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between w-full p-5 border-b border-b-ui-border",
        active && "border-l-4 border-l-brand-default bg-ui-row-even"
      )}
      onClick={() => handleSelect(conversation.id)}
    >
      <div className="flex flex-row gap-2.5">
        <CustomAvatar
          className="h-9 w-9"
          avatarUrl={avatarUrl}
          fallback={initials}
          fallbackClassName="bg-action-plus/80"
        />
        <div className="flex flex-col gap-1">
          <InfoValue className="text-sm leading-4">{nameLabel}</InfoValue>
          <InfoLabel className="leading-3.5">{userNameOrPhoneLabel}</InfoLabel>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2.5">
        {(badge || badge !== 0) && (
          <Badge className="rounded-full text-[10px] h-5 w-5 flex items-center justify-center gap-0 bg-brand-default">
            {badge}
          </Badge>
        )}
        <div className="flex flex-col gap-2.5">
          <InfoValue className="text-[10px] leading-2.5 self-end">
            {dayjs(conversation.last_message_at).format("HH:mm")}
          </InfoValue>
          <InfoLabel className="text-[10px] leading-2.5">
            {dayjs(conversation.last_message_at).format("DD.MM.YYYY")}
          </InfoLabel>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
