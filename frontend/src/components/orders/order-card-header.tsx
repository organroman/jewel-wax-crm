import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import OrderFavorite from "./order-favorite";
import OrderImportant from "./order-important";
import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";
import { Button } from "../ui/button";

interface OrderCardHeaderProps {
  orderId: number;
  isFavorite: boolean;
  isImportant: boolean;
  orderNumber: number;
  customerId: number;
  customerFullName: string;
  savingIsLoading: boolean;
}

const OrderCardHeader = ({
  orderId,
  isFavorite,
  isImportant,
  orderNumber,
  customerId,
  customerFullName,
  savingIsLoading,
}: OrderCardHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full lg:items-center flex-col lg:flex-row rounded-sm bg-ui-border lg:py-3 lg:px-6 py-2 px-4 gap-1 lg:gap-4">
      <div className="flex items-center gap-2.5">
        <OrderFavorite orderId={orderId} is_favorite={isFavorite} />
        {/* //TODO: add condition by role */}
        <OrderImportant
          orderId={orderId}
          is_important={isImportant}
          disabled={false}
        />
        <div className="flex items-center gap-2.5">
          <InfoLabel>{t("order.order")} №</InfoLabel>
          <InfoValue>{orderNumber}</InfoValue>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <InfoLabel>{t("dictionary.customer")}</InfoLabel>
        <p className="text-action-minus text-sm font-semibold">
          ID {customerId}
        </p>
        <p className="text-sm underline font-semibold">{customerFullName}</p>
      </div>
      <div className="lg:ml-auto flex items-center gap-5">
        <Button variant="secondary" className="bg-transparent rounded-sm">
          {t("order.buttons.create_invoice")}
        </Button>
        <Button
          type="submit"
          form="orderForm"
          className="text-white"
          disabled={savingIsLoading}
        >
          {savingIsLoading ? (
            <div className="flex items-center gap-2.5">
              <Loader className="size-4 text-white animate-spin" />
              {t("buttons.save")}
            </div>
          ) : (
            t("buttons.save")
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderCardHeader;
