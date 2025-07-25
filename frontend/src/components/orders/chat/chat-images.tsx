import { ChatMedia } from "@/types/order-chat.types";

import { useTranslation } from "react-i18next";
import { HeartIcon } from "lucide-react";

import ChatItemEmpty from "./chat-item-empty";
import Ellipsis from "@/assets/icons/ellipsis.svg";

interface ChatImagesProps {
  images: ChatMedia[];
}

const ChatImages = ({ images }: ChatImagesProps) => {
  const { t } = useTranslation();
  if (!images.length) {
    return (
      <ChatItemEmpty fontSize="text-sm" info={t("messages.info.no_images")} />
    );
  }
  return (
    <div className="w-full h-full overflow-y-scroll scroll-on-hover scroll-thin px-5 pt-4">
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-5">
        {images.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-center h-fit relative  border border-ui-border rounded-sm"
          >
            <a href={i.url} target="_blank">
              <img
                src={i.url}
                alt=""
                className="h-[132px] aspect-square rounded-sm"
              />
            </a>

            <div className="size-7 p-1 rounded-full flex items-center justify-center absolute top-1 right-1 bg-primary/30">
              <HeartIcon className="size-6 text-ui-sidebar" />
            </div>

            <div className="rounded-sm border border-ui-border bg-ui-sidebar max-h-[24px] p-2 flex items-center justify-center absolute -bottom-2.5">
              <Ellipsis className="text-text-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatImages;
