import { OrderMedia } from "@/types/order.types";

interface OrderImageViewProps {
  previews: OrderMedia[];
  currentIdx: number;
}

const OrderImageView = ({ previews, currentIdx }: OrderImageViewProps) => {
  return (
    <div className="w-full flex-1 overflow-hidden flex items-center justify-center">
      <img
        src={previews?.[currentIdx]?.url ?? previews?.[0].url}
        alt=""
        className="h-full aspect-auto rounded-t-md self-center"
      />
    </div>
  );
};

export default OrderImageView;
