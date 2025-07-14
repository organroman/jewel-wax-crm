import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { StarIcon } from "lucide-react";

import { useOrder } from "@/api/order/use-order";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const OrderFavorite = ({
  orderId,
  is_favorite,
}: {
  orderId: number;
  is_favorite: boolean;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { toggleFavoriteMutation } = useOrder.toggleFavorite({
    orderId,
    t,
    queryClient,
  });
  return (
    <Button
      variant="ghost"
      className="has-[>svg]:p-1.5 hover:bg-transparent"
      onClick={() => toggleFavoriteMutation.mutate()}
    >
      <StarIcon
        className={cn(
          "size-5 fill-current stroke-text-light",
          is_favorite
            ? "text-brand-default stroke-brand-default"
            : "text-transparent"
        )}
      />
    </Button>
  );
};

export default OrderFavorite;
