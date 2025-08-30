import { MessageAttachment } from "@/types/shared.types";

import dayjs from "dayjs";
import FileAttachment from "../orders/chat/file-attachment";
import { cn } from "@/lib/utils";

interface ConversationMessageProps {
  isMy: boolean;
  text?: string | null;
  attachments?: MessageAttachment[];
  created_at: Date;
}

const ConversationMessage = ({
  isMy,
  text,
  attachments,
  created_at,
}: ConversationMessageProps) => {
  const images = attachments?.filter((m) => m.type === "image") ?? [];
  const files = attachments?.filter((m) => m.type === "file") ?? [];

  return (
    <div
      className={cn(
        "w-full flex gap-0.5",
        isMy ? "self-end items-end flex-col" : "self-start flex-col"
      )}
    >
      <div
        className={cn(
          "w-full h-full rounded-sm p-2.5 flex flex-col gap-1.5 justify-center",
          isMy ? "bg-brand-menu" : "bg-ui-column"
        )}
      >
        {images?.length > 0 && (
          <div
            className={cn(
              "flex flex-col gap-1.5 w-full h-full overflow-hidden"
            )}
          >
            {images.length === 1 ? (
              <a
                href={images[0].url}
                target="_blank"
                className="block w-full h-full"
              >
                <img
                  src={images[0].url}
                  className="w-full aspect-square object-contain"
                />
              </a>
            ) : (
              images.map((i) => (
                <div key={i.id} className="flex flex-wrap  w-full h-full">
                  <a href={i.url} target="_blank">
                    <img
                      src={i.url}
                      className="max-h-25 aspect-auto object-contain"
                    />
                  </a>
                </div>
              ))
            )}
          </div>
        )}
        {files?.length > 0 &&
          files.map((f) => (
            <FileAttachment
              key={f.id}
              name={f.name}
              size={f.size}
              isMyMessage={isMy}
              fileNameFontSize="text-sm"
            />
          ))}
        <span className="font-medium text-sm text-stone-900">{text}</span>
      </div>
      <span className="text-xs text-text-muted">
        {dayjs(created_at).format("HH:mm")}
      </span>
    </div>
  );
};

export default ConversationMessage;
