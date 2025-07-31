import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import OrderFavorite from "./order-favorite";
import OrderImportant from "./order-important";
import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";
import CreateInvoice from "../shared/create-invoice";
import { Button } from "../ui/button";
import { Order } from "@/types/order.types";
import { getFullName } from "@/lib/utils";
import { Action } from "@/types/permission.types";

interface OrderCardHeaderProps {
  order?: Order;
  savingIsLoading?: boolean;
  submitBtnTitle?: string;
  hasExtraAccess?: (action: Action, entity: string) => boolean;
}

const OrderCardHeader = ({
  submitBtnTitle,
  order,
  savingIsLoading,
  hasExtraAccess = () => true,
}: OrderCardHeaderProps) => {
  const { t } = useTranslation();
  const canToggleImportant = hasExtraAccess("UPDATE", "important");
  const canViewCustomer = hasExtraAccess("VIEW", "customer");
  const canCreateInvoice = hasExtraAccess("CREATE", "payments");

  return (
    <div className="flex w-full lg:items-center flex-col lg:flex-row rounded-sm bg-ui-border lg:py-3 lg:px-6 py-2 px-4 gap-1 lg:gap-4">
      {order && (
        <div className="flex items-center gap-2.5">
          <OrderFavorite orderId={order.id} is_favorite={order.is_favorite} />
          <OrderImportant
            orderId={order.id}
            is_important={order.is_important}
            disabled={!canToggleImportant}
          />
          <div className="flex items-center gap-2.5">
            <InfoLabel>{t("order.order")} №</InfoLabel>
            <InfoValue>{order.number}</InfoValue>
          </div>
        </div>
      )}
      {order && canViewCustomer && (
        <div className="flex items-center gap-2.5">
          <InfoLabel>{t("dictionary.customer")}</InfoLabel>
          <p className="text-action-minus text-sm font-semibold">
            ID {order.customer.id}
          </p>
          <p className="text-sm underline font-semibold">
            {getFullName(
              order.customer.first_name,
              order.customer.last_name,
              order.customer.patronymic
            )}
          </p>
        </div>
      )}
      <div className="lg:ml-auto flex items-center gap-5">
        {order && submitBtnTitle && canCreateInvoice && (
          <CreateInvoice order={order} />
        )}
        {submitBtnTitle && (
          <Button
            type="submit"
            form="orderForm"
            className="text-white"
            disabled={savingIsLoading}
          >
            {savingIsLoading ? (
              <div className="flex items-center gap-2.5">
                <Loader className="size-4 text-white animate-spin" />
                {submitBtnTitle}
              </div>
            ) : (
              submitBtnTitle
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCardHeader;
