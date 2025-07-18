"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface OrderChatProps {
  chatId: number | null;
}

const OrderChat = ({ chatId }: OrderChatProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  useEffect(() => {
    socket?.emit("chat:join", { chatId: "..." });
    socket?.on("chat:newMessage", (msg) => {
      console.log(msg);
    });
    return () => {
      socket?.off("chat:newMessage");
    };
  }, [socket]);
  return (
    <div className="w-full h-full rounded-b-sm bg-ui-sidebar">
      {!chatId && (
        <div className="h-2/5 flex items-center justify-center">
          <p className="font-bold text-text-muted text-xl">{t("messages.info.no_chat")} </p>
        </div>
      )}
    </div>
  );
};

export default OrderChat;
