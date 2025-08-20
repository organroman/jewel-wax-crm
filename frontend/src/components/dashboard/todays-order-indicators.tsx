import { useTranslation } from "react-i18next";

import InfoValue from "../shared/typography/info-value";

import OrderIcon from "../../assets/icons/orders.svg";

interface TodaysOrderIndicatorsProps {
  totalOrders: number;
  totalModeling: number;
  totalMilling: number;
  totalPrinting: number;
  totalDelivery: number;
}

const TodaysOrderIndicators = ({
  totalDelivery,
  totalMilling,
  totalModeling,
  totalOrders,
  totalPrinting,
}: TodaysOrderIndicatorsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-7 items-center justify-center border border-ui-border bg-ui-sidebar rounded-sm">
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2.5 items-center">
          <OrderIcon className="text-text-muted !w-9 !h-9" />
          <p className="font-bold text-base/5">
            {t("dashboard.today_orders")
              .split(" ")
              .map((word, idx) => (
                <span key={idx} className={idx === 1 ? "block" : "inline"}>
                  {word + " "}
                </span>
              ))}
          </p>
        </div>
        <h3 className="text-4xl text-brand-default">{totalOrders}</h3>
      </div>
      <div className="w-full mt-5 flex flex-wrap items-center gap-2.5 justify-between ">
        <div className="flex flex-row gap-2.5">
          <p className="text-action-plus text-xs font-medium">
            {t("dashboard.modeling")}:
          </p>
          <InfoValue className="font-bold">{totalModeling}</InfoValue>
        </div>
        <div className="flex flex-row gap-2.5">
          <p className="text-accent-violet text-xs font-medium">
            {t("dashboard.print")}:
          </p>
          <InfoValue className="font-bold">{totalPrinting}</InfoValue>
        </div>
        <div className="flex flex-row gap-2.5">
          <p className="text-text-regular text-xs font-medium">
            {t("dashboard.milling")}:
          </p>
          <InfoValue className="font-bold">{totalMilling}</InfoValue>
        </div>
        <div className="flex flex-row gap-2.5">
          <p className="text-action-alert text-xs font-medium">
            {t("dashboard.delivery")}:
          </p>
          <InfoValue className="font-bold">{totalDelivery}</InfoValue>
        </div>
      </div>
    </div>
  );
};

export default TodaysOrderIndicators;
