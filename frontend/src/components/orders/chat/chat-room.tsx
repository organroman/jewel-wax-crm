import { ChatMessage } from "@/types/order-chat.types";
import { MessageAttachment } from "@/types/shared.types";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useChat } from "@/api/order-chat/use-order-chat";

import { useOrderChat } from "@/hooks/use-socket-chat";

import ChatInput from "../../shared/chat-input";
import OrderName from "./order-name";
import Messages from "./messages";

interface ChatRoomProps {
  chatId: number;
  orderName: string;
  currentUserId: number;
}

const ChatRoom = ({ chatId, orderName, currentUserId }: ChatRoomProps) => {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<MessageAttachment[]>([]);

  const tabParam = searchParams.get("tab");

  const { data, isLoading } = useChat.getLatestMessages({
    chatId,
    query: `limit=100`,
    enabled: Boolean(chatId),
  });

  const getLastMessageId = () => messages[messages.length - 1]?.id;

  const { sendMessage, markRead, unreadForThisChat } = useOrderChat({
    chatId,
    onNewMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
    getLastMessageId,
  });

  useEffect(() => {
    if (data && !isLoading) setMessages(data);
  }, [data]);

  const firstUnreadId = useMemo(() => {
    const start = Math.max(0, messages.length - unreadForThisChat);
    for (let i = start; i < messages.length; i++) {
      const m = messages[i];
      if (m.sender_id !== currentUserId) return m.id;
    }
    return messages[start]?.id;
  }, [messages, unreadForThisChat, currentUserId]);

  return (
    <div className="w-full h-full overflow-hidden p-2.5 bg-ui-column rounded-sm flex flex-col gap-2.5">
      <OrderName name={orderName} />
      {isLoading ? (
        <Loader className="size-5 animate-spin text-brand-default" />
      ) : (
        <Messages
          messages={messages}
          currentUserId={currentUserId}
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
        sendMessage={sendMessage}
        files={newFiles}
        setFiles={setNewFiles}
        previews={previews}
        setPreviews={setPreviews}
        canImageSelect={true}
        inputAutoFocusCondition={tabParam === "chat"}
      />
    </div>
  );
};

export default ChatRoom;
