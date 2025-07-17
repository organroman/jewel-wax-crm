"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect } from "react";

const OrderChat = () => {
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
  return <div>OrderChat</div>;
};

export default OrderChat;
