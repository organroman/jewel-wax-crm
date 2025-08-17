import { OrderMedia } from "@/types/order.types";

import { Dispatch, SetStateAction } from "react";
import { FileCheckIcon, FileCogIcon } from "lucide-react";

import InfoValue from "@/components/shared/typography/info-value";
import { cn } from "@/lib/utils";

interface OrderFilesPreviewProps {
  previews: OrderMedia[];
  setCurrentIdx: Dispatch<SetStateAction<number>>;
  currentIdx: number;
}

const OrderFilesPreview = ({
  previews,
  setCurrentIdx,
  currentIdx,
}: OrderFilesPreviewProps) => {
  return (
    <div className="mt-5 flex flex-row w-full gap-2.5 overflow-x-scroll">
      {previews?.map((file, index) => (
        <div
          key={file.url}
          className={cn(
            "h-16 w-24 flex flex-col items-center gap-2 justify-center mb-2.5"
          )}
          onClick={() => setCurrentIdx(index)}
        >
          {file?.is_uploaded_by_modeller ? (
            <FileCheckIcon
              className={cn(
                "size-7 stroke-1 text-brand-default",
                index === currentIdx && " size-8 stroke-1.5"
              )}
            />
          ) : (
            <FileCogIcon
              className={cn(
                "size-7 stroke-1",
                index === currentIdx && " size-8 stroke-1.5"
              )}
            />
          )}
          <InfoValue
            className={cn(
              "text-xs font-regular w-full truncate",
              index === currentIdx && "text-sm font-semibold"
            )}
          >
            {file.name}
          </InfoValue>
        </div>
      ))}
    </div>
  );
};

export default OrderFilesPreview;
