"use client";

import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import { useChat } from "@/api/order-chat/use-order-chat";

import ChatRoom from "./chat-room";
import ChatInfo from "./chat-info";

interface OrderChatProps {
  chatId: number;
  orderName: string;
  currentUserId: number;
  orderId: number;
}

const OrderChat = ({
  chatId,
  orderName,
  currentUserId,
  orderId,
}: OrderChatProps) => {
  const { t } = useTranslation();

  const {
    data: chatDetails,
    isLoading,
    error,
  } = useChat.getChatDetails({ chatId, enabled: Boolean(chatId) });

  const opponent = chatDetails?.participants.find(
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
          chatId={chatId}
          orderName={orderName}
          currentUserId={currentUserId}
        />
        <ChatInfo
          opponent={opponent}
          media={chatDetails?.media ?? []}
          chatId={chatId}
          orderId={orderId}
        />
      </div>
    </div>
  );
};

export default OrderChat;
