import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import OrderFavorite from "./order-favorite";
import OrderImportant from "./order-important";
import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";
import { Button } from "../ui/button";
import { Order } from "@/types/order.types";
import { getFullName } from "@/lib/utils";

interface OrderCardHeaderProps {
  order?: Order;
  savingIsLoading?: boolean;
  submitBtnTitle?: string;
}

const OrderCardHeader = ({
  submitBtnTitle,
  order,
  savingIsLoading,
}: OrderCardHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full lg:items-center flex-col lg:flex-row rounded-sm bg-ui-border lg:py-3 lg:px-6 py-2 px-4 gap-1 lg:gap-4">
      {order && (
        <div className="flex items-center gap-2.5">
          <OrderFavorite orderId={order.id} is_favorite={order.is_favorite} />
          {/* //TODO: add condition by role */}
          <OrderImportant
            orderId={order.id}
            is_important={order.is_important}
            disabled={false}
          />
          <div className="flex items-center gap-2.5">
            <InfoLabel>{t("order.order")} №</InfoLabel>
            <InfoValue>{order.number}</InfoValue>
          </div>
        </div>
      )}
      {order && (
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
        {order && submitBtnTitle && (
          <Button variant="secondary" className="bg-transparent rounded-sm">
            {t("order.buttons.create_invoice")}
          </Button>
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
