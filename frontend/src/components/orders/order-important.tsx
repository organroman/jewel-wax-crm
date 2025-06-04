import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CircleAlertIcon } from "lucide-react";

import { useOrder } from "@/api/orders/use-order";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const OrderImportant = ({
  orderId,
  is_important,
}: {
  orderId: number;
  is_important: boolean;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { toggleImportantMutation } = useOrder.toggleImportant({
    orderId,
    t,
    queryClient,
  });
  return (
    <Button
      variant="ghost"
      className="has-[>svg]:p-1.5 hover:bg-transparent"
      onClick={() => toggleImportantMutation.mutate(!is_important)}
    >
      <CircleAlertIcon
        className={cn(
          "size-5 text-ui-border",
          is_important && "text-action-alert"
        )}
      />
    </Button>
  );
};

export default OrderImportant;
