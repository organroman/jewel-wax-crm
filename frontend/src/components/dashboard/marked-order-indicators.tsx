import { useTranslation } from "react-i18next";

import InfoValue from "../shared/typography/info-value";

import FlashCircleIcon from "../../assets/icons/flash-circle.svg";
import FavoriteIcon from "../../assets/icons/favorite.svg";
import ImportantIcon from "../../assets/icons/important.svg";

interface MarkedOrderIndicatorsProps {
  totalImportantOrders: number;
  totalFavoriteOrders: number;
  totalProblemOrders: number;
}

const MarkedOrderIndicators = ({
  totalFavoriteOrders,
  totalImportantOrders,
  totalProblemOrders,
}: MarkedOrderIndicatorsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-7 w-[300px]  border border-ui-border bg-ui-sidebar rounded-sm">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FlashCircleIcon />
          <InfoValue>{t("dashboard.problem_orders")}</InfoValue>
        </div>
        <span className="text-brand-dark text-2xl font-semibold ">
          {totalProblemOrders}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FavoriteIcon />
          <InfoValue>{t("dashboard.favorite")}</InfoValue>
        </div>
        <span className="text-brand-dark text-2xl font-semibold ">
          {totalFavoriteOrders}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ImportantIcon />
          <InfoValue>{t("dashboard.important")}</InfoValue>
        </div>
        <span className="text-brand-dark text-2xl font-semibold ">
          {totalImportantOrders}
        </span>
      </div>
    </div>
  );
};

export default MarkedOrderIndicators;
