import { ChatMedia, ChatMessage } from "@/types/order-chat.types";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import i18nextConfig from "../../../../next-i18next.config";

import InfoLabel from "@/components/shared/typography/info-label";
import Message from "./message";
import ChatItemEmpty from "./chat-item-empty";

import { groupMessagesByDate } from "@/lib/group-messages";
import { dateFnsLocaleMap } from "@/lib/date-fns-locale-map";
import { cn } from "@/lib/utils";

interface MessagesProps {
  messages: ChatMessage[];
  currentUserId: number;
  setFiles: Dispatch<SetStateAction<File[]>>;
  previews: ChatMedia[];
  setPreviews: Dispatch<SetStateAction<ChatMedia[]>>;
}

const Messages = ({
  messages,
  currentUserId,
  setFiles,
  previews,
  setPreviews,
}: MessagesProps) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentLanguage = i18n.language || i18nextConfig.i18n.defaultLocale;
  const locale = dateFnsLocaleMap[currentLanguage] || dateFnsLocaleMap["ua"];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const newFiles = Array.from(e.dataTransfer.files);

    if (newFiles) {
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [
        ...prev,
        ...newFiles.map((f) => ({
          type: f.type.startsWith("image")
            ? "image"
            : ("file" as "image" | "file"),
          url: URL.createObjectURL(f),
          name: f.name,
          size: f.size,
        })),
      ]);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      const timeout = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages, locale, t);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-5 overflow-y-scroll scroll-thin scroll-on-hover bg-ui-row-even py-2.5 px-5",
        isDragging
          ? "bg-ui-sidebar border-2 rounded-sm border-dashed border-text-regular"
          : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 z-10 rounded-md pointer-events-none" />
      )}

      {messages.length === 0 && (
        <ChatItemEmpty info={t("messages.info.no_messages")} />
      )}

      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="flex flex-col gap-5">
          <InfoLabel className="text-sm text-text-muted text-center">
            {date}
          </InfoLabel>
          {msgs.map((msg, idx) => {
            const isLast = idx === msgs.length - 1;
            return (
              <div
                key={msg.id}
                ref={isLast ? bottomRef : undefined}
                className={cn(
                  "max-w-[60%]",
                  msg.sender_id === currentUserId
                    ? "self-end justify-items-end flex-row"
                    : "self-start flex-row-reverse"
                )}
              >
                <Message
                  key={msg?.id}
                  isMy={msg.sender_id === currentUserId}
                  text={msg?.message}
                  media={msg?.media}
                  created_at={msg.created_at}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Messages;
