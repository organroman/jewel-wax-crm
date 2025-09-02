import { Conversation, Message } from "@/types/request.types";
import { MessageAttachment } from "@/types/shared.types";

import { Loader } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { useRequest } from "@/api/request/use-request";
import { useExternalChat } from "@/hooks/use-external-chat";

import CustomAvatar from "../shared/custom-avatar";
import InfoValue from "../shared/typography/info-value";
import InfoLabel from "../shared/typography/info-label";
import ChatInput from "../shared/chat-input";
import ConversationMessages from "./conversation-messages";

import { Button } from "../ui/button";

import { getFullName, getInitials } from "@/lib/utils";

interface ConversationRoomProps {
  conversation: Conversation;
  userId: number;
}

const ConversationRoom = ({ conversation, userId }: ConversationRoomProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<MessageAttachment[]>([]);

  const { data, isLoading } = useRequest.getMessages({
    conversationId: conversation.id,
    enabled: Boolean(conversation),
  });

  const getLastMessageId = () => Number(messages[messages.length - 1].id);

  const { send, markRead, unreadForThisChat } = useExternalChat({
    conversationId: conversation.id,
    onNewMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
    getLastMessageId,
  });

  useEffect(() => {
    if (data && !isLoading) setMessages(data);
  }, [data]);

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
    ? person.phones[0]?.number
    : contact?.username;

  const firstUnreadId = useMemo(() => {
    if (!unreadForThisChat) return undefined;
    const idx = Math.max(0, messages.length - unreadForThisChat);
    return messages[idx]?.id;
  }, [messages, unreadForThisChat]);

  const handleCreatePerson = () => {
    const query = `personId=${person?.id}&conversationId=${conversation.id}`;

    router.push(`persons/new?${query}`);
  };

  const handleCreateOrder = () => {
    const query = `personId=${person?.id}&channel=${conversation.provider}&conversationId=${conversation.id}`;

    router.push(`orders/new?${query}`);
  };

  return (
    <div className="w-full h-full overflow-hidden bg-ui-column  border-r border-ui-border flex flex-col">
      <div className="w-full p-2.5 pt-3.5 border-b border-ui-border flex items-center justify-between bg-ui-sidebar">
        <div className="flex flex-row gap-2.5">
          <CustomAvatar
            className="h-13 w-13"
            avatarUrl={avatarUrl}
            fallback={initials}
            fallbackClassName="bg-action-plus/80"
          />
          <div className="flex flex-col gap-0.5">
            <InfoValue className="text-sm leading-4">{nameLabel}</InfoValue>
            <InfoLabel className="leading-3.5">
              {userNameOrPhoneLabel}
            </InfoLabel>

            <InfoLabel className="text-[11px]">
              {t("person.person")}
              <span className="text-action-minus">
                {" "}
                ID: {person?.id || "-"}
              </span>
            </InfoLabel>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          {!person?.id && (
            <Button
              variant="secondary"
              className="rounded-sm hover:border-brand-default/80"
              onClick={handleCreatePerson}
            >
              {t("person.add_person")}
            </Button>
          )}
          <Button onClick={handleCreateOrder}>
            {t("request.buttons.create_order")}
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loader className="size-5 animate-spin text-brand-default" />
      ) : (
        <ConversationMessages
          messages={messages}
          currentUserId={userId}
          setFiles={setNewFiles}
          previews={previews}
          setPreviews={setPreviews}
          unreadFirstId={firstUnreadId}
          onReachedBottom={markRead}
        />
      )}

      <ChatInput
        isLoading={isLoading}
        text={text}
        setText={setText}
        sendMessage={send}
        files={newFiles}
        setFiles={setNewFiles}
        previews={previews}
        setPreviews={setPreviews}
        canImageSelect={false}
        inputAutoFocusCondition={Boolean(conversation.id)}
      />
    </div>
  );
};

export default ConversationRoom;
