import { FileIcon } from "lucide-react";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import { cn, formatFileSize } from "@/lib/utils";

interface FileAttachmentProps {
  name: string;
  size: number;
  isMyMessage?: boolean;
  fileNameFontSize?: string;
}

const FileAttachment = ({
  name,
  size,
  isMyMessage,
  fileNameFontSize = "text-base",
}: FileAttachmentProps) => {
  return (
    <div key={name} className="flex items-center gap-5">
      <div
        className={cn(
          " w-10 h-10 rounded-full flex items-center justify-center",
          isMyMessage || isMyMessage === undefined
            ? "bg-accent-lavender"
            : "bg-accent-lightgreen"
        )}
      >
        <FileIcon className="size-5 text-text-muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InfoValue
          className={cn("text-text-muted font-semibold", fileNameFontSize)}
        >
          {name}
        </InfoValue>
        <InfoLabel className="text-text-light font-medium">
          {formatFileSize(size)}
        </InfoLabel>
      </div>
    </div>
  );
};

export default FileAttachment;
