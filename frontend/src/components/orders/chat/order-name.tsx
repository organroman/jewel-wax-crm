import InfoLabel from "@/components/shared/typography/info-label";
import React from "react";
import { useTranslation } from "react-i18next";

interface OrderNameProps {
  name: string;
}

const OrderName = ({ name }: OrderNameProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-ui-sidebar px-5 py-2 flex items-center gap-1.5">
      <InfoLabel className="text-sm">{t("order.labels.name")}:</InfoLabel>
      <InfoLabel className="text-sm text-text-regular">{name}</InfoLabel>
    </div>
  );
};

export default OrderName;
