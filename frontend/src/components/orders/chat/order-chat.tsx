"use client";

import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import { useChat } from "@/api/order-chat/use-order-chat";

import ChatRoom from "./chat-room";
import ChatInfo from "./chat-info";
import { ChatParticipant } from "@/types/order-chat.types";
import { Action } from "@/types/permission.types";

interface OrderChatProps {
  chat: { chat_id: number; participants: ChatParticipant[] };
  orderName: string;
  currentUserId: number;
  orderId: number;
  hasExtraAccess?: (action: Action, entity: string) => boolean;
}

const OrderChat = ({
  chat,
  orderName,
  currentUserId,
  orderId,
  hasExtraAccess = () => true,
}: OrderChatProps) => {
  const { t } = useTranslation();

  const {
    data: chatDetails,
    isLoading,
    error,
  } = useChat.getChatDetails({
    chatId: chat.chat_id,
    enabled: Boolean(chat.chat_id),
  });

  const canDeleteOrderChat = hasExtraAccess("DELETE", "chat");

  const opponent = chat?.participants.find(
    (p) => p.person_id !== currentUserId
  );

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-hidden rounded-b-sm bg-ui-sidebar pt-7 flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-brand-default" />
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="w-full h-full overflow-hidden rounded-b-sm bg-ui-sidebar pt-7">
      <div className="w-full h-full overflow-hidden flex gap-10">
        <ChatRoom
          chatId={chat.chat_id}
          orderName={orderName}
          currentUserId={currentUserId}
        />
        <ChatInfo
          opponent={opponent}
          media={chatDetails?.media ?? []}
          chatId={chat.chat_id}
          orderId={orderId}
          canDeleteOrderChat={canDeleteOrderChat}
        />
      </div>
    </div>
  );
};

export default OrderChat;
