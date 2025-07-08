import { OrderMedia } from "@/types/order.types";

import { FileCheckIcon, FileCogIcon } from "lucide-react";

import InfoValue from "@/components/shared/typography/info-value";

import { cn } from "@/lib/utils";

interface OrderFileViewProps {
  previews: OrderMedia[];
  currentIdx: number;
}

const OrderFileView = ({ previews, currentIdx }: OrderFileViewProps) => {
  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      {previews[currentIdx]?.is_uploaded_by_modeller ? (
        <FileCheckIcon className="size-10 stroke-1 text-brand-default" />
      ) : (
        <FileCogIcon className={cn("size-10 stroke-1")} />
      )}
      <InfoValue className="font-regular text-center">
        {previews[currentIdx]?.name}
      </InfoValue>
    </div>
  );
};

export default OrderFileView;
