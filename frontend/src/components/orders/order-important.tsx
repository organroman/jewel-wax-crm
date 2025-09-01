import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/order/use-order";

import { Button } from "../ui/button";
import ImportantIcon from "../shared/important-icon";

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
      <ImportantIcon active={is_important} />
    </Button>
  );
};

export default OrderImportant;
