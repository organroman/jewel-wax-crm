
import { useEffect, useRef } from "react";
import { getSocket } from "@/socket/socket";
import { ChatMedia } from "@/types/order-chat.types";

export const useOrderChat = ({
  chatId,
  onNewMessage,
}: {
  chatId: number;
  onNewMessage: (msg: any) => void;
}) => {
  const socket = getSocket();
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!socket || !chatId) return;

    if (!joinedRef.current) {
      socket.emit("chat:join", { chatId });
      joinedRef.current = true;
    }

    socket.on("chat:newMessage", onNewMessage);

    return () => {
      socket.off("chat:newMessage", onNewMessage);
    };
  }, [socket, chatId, onNewMessage]);

  const sendMessage = (message: string, media?: ChatMedia[]) => {
    socket.emit("chat:send", { chatId, message, media });
  };

  return { sendMessage };
};
