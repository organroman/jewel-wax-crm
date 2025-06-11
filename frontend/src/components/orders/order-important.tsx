import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CircleAlertIcon } from "lucide-react";

import { useOrder } from "@/api/orders/use-order";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const OrderImportant = ({
  orderId,
  is_important,
  disabled,
}: {
  orderId: number;
  is_important: boolean;
  disabled: boolean;
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
      className="has-[>svg]:p-1.5 hover:bg-transparent disabled:opacity-100"
      onClick={() => toggleImportantMutation.mutate(!is_important)}
      disabled={disabled}
    >
      <CircleAlertIcon
        className={cn(
          "size-5 text-ui-row",
          is_important && "text-action-alert"
        )}
      />
    </Button>
  );
};

export default OrderImportant;
