import { ChatMedia } from "@/types/order-chat.types";
import { HeartIcon } from "lucide-react";
import dayjs from "dayjs";

import FileAttachment from "./file-attachment";
import Ellipsis from "@/assets/icons/ellipsis.svg";
import { cn } from "@/lib/utils";

interface MessageProps {
  isMy: boolean;
  text?: string;
  media?: ChatMedia[];
  created_at: string;
}

const Message = ({ isMy, text, media, created_at }: MessageProps) => {
  const images = media?.filter((m) => m.type === "image") ?? [];
  const files = media?.filter((m) => m.type === "file") ?? [];

  return (
    <div
      className={cn(
        "w-full flex items-center gap-2.5",
        isMy
          ? "self-end justify-items-end flex-row"
          : "self-start flex-row-reverse"
      )}
    >
      <HeartIcon className="text-text-muted size-6 shrink-0" />
      <div
        className={cn(
          "w-full h-fit rounded-sm p-2.5 flex flex-col gap-1.5 justify-center",
          isMy ? "bg-accent-lightgreen" : "bg-accent-lavender"
        )}
      >
        {images?.length > 0 && (
          <div
            className={cn(
              "flex flex-col gap-1.5 w-full  overflow-hidden",
              images?.length > 1 ? "max-h-fit" : "max-h-[240px]"
            )}
          >
            {images.length === 1 ? (
              <a href={images[0].url} target="_blank">
                <img src={images[0].url} className="h-full aspect-auto" />
              </a>
            ) : (
              images.map((i) => (
                <div key={i.id} className="flex flex-wrap  w-full h-full">
                  <a href={images[0].url} target="_blank">
                    <img src={i.url} className="max-h-25 aspect-auto" />
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
      <div className="flex flex-col">
        <span className="text-xs text-text-muted">
          {dayjs(created_at).format("HH:mm")}
        </span>
        <div className="rounded-sm border border-ui-border p-2 flex items-center justify-center">
          <Ellipsis className="text-text-muted" />
        </div>
      </div>
    </div>
  );
};

export default Message;
