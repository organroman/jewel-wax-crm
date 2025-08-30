import { Message } from "@/types/request.types";

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { format, isToday, isYesterday } from "date-fns";

import i18nextConfig from "../../../next-i18next.config";
import { dateFnsLocaleMap } from "@/lib/date-fns-locale-map";

import { cn } from "@/lib/utils";
import InfoLabel from "../shared/typography/info-label";
import ConversationMessage from "./conversation-message";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { MessageAttachment } from "@/types/shared.types";

interface MessagesProps {
  messages: Message[];
  currentUserId: number;
  setFiles: Dispatch<SetStateAction<File[]>>;
  previews: MessageAttachment[];
  setPreviews: Dispatch<SetStateAction<MessageAttachment[]>>;
  unreadFirstId?: string;
  onReachedBottom?: () => void;
}

const ConversationMessages = ({
  messages,
  setFiles,
  previews,
  setPreviews,
  unreadFirstId,
  onReachedBottom,
  currentUserId,
}: MessagesProps) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const unreadRef = useRef<HTMLDivElement | null>(null);

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
    if (unreadFirstId != null) {
      if (!unreadRef.current) return;

      unreadRef.current.scrollIntoView({ block: "center", behavior: "auto" });
      return;
    }

    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 150);
    return () => clearTimeout(timeout);
  }, [messages, unreadFirstId]);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;

    if (atBottom) onReachedBottom?.();
  };

  const groupedMessages: Record<string, Message[]> = {};
  messages.forEach((msg) => {
    const date = new Date(msg.created_at);

    let dateKey = format(date, "d MMMM yyyy", { locale });
    if (isToday(date)) {
      dateKey = t("dictionary.today");
    } else if (isYesterday(date)) {
      dateKey = t("dictionary.yesterday");
    }

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }

    groupedMessages[dateKey].push(msg);
  });

  const firstUnreadIdSet = useMemo(
    () => new Set<string>(unreadFirstId ? [unreadFirstId] : []),
    [unreadFirstId]
  );

  return (
    <div
      ref={scrollRef}
      className={cn(
        "w-full h-full flex flex-col gap-5 overflow-y-auto bg-accent-purple-light py-2.5 px-5",
        isDragging
          ? "bg-ui-sidebar border-2 rounded-sm border-dashed border-text-regular"
          : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onScroll={onScroll}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 z-10 rounded-md pointer-events-none" />
      )}

      {messages.length === 0 && <p>No messages</p>}

      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="flex flex-col gap-5">
          <InfoLabel className="text-sm text-text-regular text-center">
            {date}
          </InfoLabel>
          {msgs.map((msg, idx) => {
            const isLast = idx === msgs.length - 1;
            const isMine = msg.sender_person_id === currentUserId;
            const showUnreadDivider =
              !!unreadFirstId && firstUnreadIdSet.has(msg.id) && !isMine;

            return (
              <Fragment key={msg.id}>
                {showUnreadDivider && (
                  <div
                    ref={unreadRef}
                    className="flex items-center gap-2.5 my-2"
                  >
                    <Separator className="flex-1 bg-ui-border h-0.5" />
                    <Badge className="my-2 bg-brand-default">
                      {t("messages.info.new_messages")}
                    </Badge>

                    <Separator className="flex-1 bg-ui-border h-0.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "flex w-full",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("max-w-[60%]")}>
                    <ConversationMessage
                      key={msg?.id}
                      isMy={msg.direction === "outbound"}
                      text={msg?.body}
                      attachments={msg.attachments}
                      created_at={
                        msg.direction === "outbound"
                          ? msg.created_at
                          : msg.sent_at
                      }
                    />
                  </div>
                </div>

                <div ref={isLast ? bottomRef : undefined} />
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ConversationMessages;
