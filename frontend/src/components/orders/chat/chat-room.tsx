import { ChatMedia, ChatMessage } from "@/types/order-chat.types";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import { useChat } from "@/api/order-chat/use-order-chat";

import { useOrderChat } from "@/hooks/use-socket-chat";

import OrderName from "./order-name";
import Messages from "./messages";
import ChatInput from "./chat-input";

interface ChatRoomProps {
  chatId: number;
  orderName: string;
  currentUserId: number;
}

const ChatRoom = ({ chatId, orderName, currentUserId }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<ChatMedia[]>([]);

  const { data, isLoading } = useChat.getLatestMessages({
    chatId,
    query: `limit=100`,
    enabled: Boolean(chatId),
  });

  const { sendMessage } = useOrderChat({
    chatId,
    onNewMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
  });

  useEffect(() => {
    if (data && !isLoading) setMessages(data);
  }, [data]);

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
      />
    </div>
  );
};

export default ChatRoom;
