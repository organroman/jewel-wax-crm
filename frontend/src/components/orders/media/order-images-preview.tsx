import { OrderMedia } from "@/types/order.types";
import React, { Dispatch, SetStateAction } from "react";

interface OrderImagesPreviewProps {
  previews: OrderMedia[];
  setCurrentIdx: Dispatch<SetStateAction<number>>;
}

const OrderImagesPreview = ({
  previews,
  setCurrentIdx,
}: OrderImagesPreviewProps) => {
  return (
    <div className="mt-5 pb-4 flex flex-row w-full gap-2.5 overflow-x-scroll scroll-on-hover scrollbar-thin">
      {previews?.map((image, index) => (
        <div
          key={image?.url}
          className="h-16 p-1 rounded-md w-28 shrink-0 bg-ui-column flex items-center justify-center"
          onClick={() => setCurrentIdx(index)}
        >
          <img
            src={image?.url}
            className="h-full aspect-auto rounded-md "
            alt={`image`}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderImagesPreview;
