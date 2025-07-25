import { ChatMedia } from "@/types/order-chat.types";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ImagePlusIcon, PaperclipIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useUpload } from "@/api/upload/use-upload";
import { useDialog } from "@/hooks/use-dialog";

import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import SendMediaModal from "./send-media-modal";
import SendIcon from "@/assets/icons/send.svg";

interface ChatInputProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  sendMessage: (text: string, media?: ChatMedia[]) => void;
  isLoading: boolean;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  previews: ChatMedia[];
  setPreviews: Dispatch<SetStateAction<ChatMedia[]>>;
}

const ChatInput = ({
  text,
  setText,
  sendMessage,
  isLoading,
  files,
  setFiles,
  previews,
  setPreviews,
}: ChatInputProps) => {
  const { dialogOpen, setDialogOpen } = useDialog();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");

  const { uploadImagesMutation } = useUpload.uploadImages();

  useEffect(() => {
    if (tabParam === "chat") {
      inputRef.current?.focus();
    }
  }, [tabParam]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "file"
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => ({
        type: type,
        url: URL.createObjectURL(f),
        name: f.name,
        size: f.size,
      })),
    ]);
  };

  const handleSend = () => {
    const hasText = text.trim() !== "";
    const hasFiles = files.length > 0;

    if (!hasText && !hasFiles) return;

    const resetForm = () => {
      setText("");
      setPreviews([]);
      setFiles([]);
      setDialogOpen(false);
    };

    if (hasFiles) {
      uploadImagesMutation.mutate(files, {
        onSuccess: (data) => {
          const media: ChatMedia[] = data.map((mediaItem) => ({
            url: mediaItem.url,
            type: mediaItem.format === "image" ? "image" : "file",
            public_id: mediaItem.public_id,
            name: mediaItem.name,
            size: mediaItem.size,
          }));

          sendMessage(hasText ? text : "", media);
          resetForm();
        },
      });
    } else {
      sendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (files.length) {
      setDialogOpen(true);
    } else setDialogOpen(false);
  }, [files]);

  const images = previews.filter((i) => i.type === "image");
  const others = files.filter((f) => !f.type.startsWith("image"));

  const onCancel = () => {
    setFiles([]);
    setPreviews([]);
    setDialogOpen(false);
  };

  return (
    <div className="min-w-fit mx-5 my-7 shrink-0 relative ">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className=" overflow-scroll rounded-sm bg-ui-sidebar"
        ref={inputRef}
      />

      <SendIcon
        onClick={handleSend}
        className="stroke-accent-green absolute top-2 right-4 cursor-pointer"
      />

      <label className="flex items-center justify-center cursor-pointer absolute top-2 right-14">
        <input
          type="file"
          hidden
          multiple
          onChange={(e) => handleFileChange(e, "file")}
          disabled={isLoading}
        />
        <PaperclipIcon className="size-5" />
      </label>
      <label className="flex items-center justify-center cursor-pointer absolute top-2 right-24">
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, "image")}
          disabled={isLoading}
        />
        <ImagePlusIcon className="size-5" />
      </label>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SendMediaModal
          files={others}
          images={images}
          handleKeyDown={handleKeyDown}
          onCancel={onCancel}
          text={text}
          setText={setText}
          handleSend={handleSend}
          isLoading={uploadImagesMutation.isPending}
        />
      </Dialog>
    </div>
  );
};

export default ChatInput;
