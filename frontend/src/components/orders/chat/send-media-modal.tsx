import { ChatMedia } from "@/types/order-chat.types";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileAttachment from "./file-attachment";

import { formatFileSize } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SendMediaModalProps {
  images: ChatMedia[];
  files: File[];
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  handleSend: () => void;
  isLoading: boolean;
}

const SendMediaModal = ({
  images,
  files,
  text,
  setText,
  handleKeyDown,
  onCancel,
  handleSend,
  isLoading,
}: SendMediaModalProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const title =
    images.length && files.length
      ? `${images.length + files.length} ${t("order_chat.selected_items")}`
      : images.length
      ? t("order_chat.send_image")
      : t("order_chat.send_file");

  return (
    <DialogContent
      hideClose
      className="max-w-[95vw] min-h-fit max-h-[80vh] lg:max-h-[90vh] p-2.5 lg:p-5 min-w-fit w-full lg:max-w-lg overflow-visible bg-ui-sidebar"
    >
      <DialogHeader className="flex flex-col justify-center text-center">
        <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2.5">
        {images.length > 0 &&
          (images.length === 1 ? (
            <div
              key={images[0].name}
              className="flex items-center justify-center bg-ui-column rounded-sm"
            >
              <img src={images[0].url} className="max-h-[180px] aspect-auto" />
            </div>
          ) : (
            images.map((i) => (
              <div key={i.name} className="flex items-center gap-5">
                <img src={i.url} className="max-h-[80px] aspect-square" />
                <div className="flex flex-col gap-1">
                  <InfoValue className="text-text-muted font-semibold text-base">
                    {i.name}
                  </InfoValue>
                  <InfoLabel className="text-text-light font-medium">
                    {formatFileSize(i.size)}
                  </InfoLabel>
                </div>
              </div>
            ))
          ))}
        {files.length > 0 &&
          files.map((f) => (
            <FileAttachment key={f.name} name={f.name} size={f.size} />
          ))}
      </div>

      <div className="w-full flex flex-col gap-1.5">
        <Label htmlFor="chat-input">{t("order_chat.comment")}</Label>
        <Input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-sm"
          ref={inputRef}
        />
      </div>

      <DialogFooter className="w-full flex flex-row mt-4 lg:mt-0 space-x-2 sm:justify-end">
        <Button
          variant="secondary"
          className="rounded-sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          className="rounded-sm px-6"
          disabled={isLoading}
          onClick={handleSend}
        >
          {isLoading ? t("buttons.send_continuous") : t("buttons.send")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SendMediaModal;
