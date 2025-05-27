import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { Separator } from "../../ui/separator";

import InfoValue from "@/components/shared/typography/info-value";
import InfoLabel from "@/components/shared/typography/info-label";

interface PersonDetailsMetaHeaderProps {
  createdAt?: Date;
  id?: number;
  isActive: boolean;
}

const PersonMetaHeader = ({
  createdAt,
  id,
  isActive,
}: PersonDetailsMetaHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2.5">
      <InfoLabel>{t("person.labels.created_at")}:</InfoLabel>
      <InfoValue> {dayjs(createdAt).format("DD.MM.YYYY")}</InfoValue>
      <InfoValue className="text-action-alert">ID: {id}</InfoValue>
      <Separator
        className="bg-ui-border data-[orientation=vertical]:h-[12px] w-[1px] "
        orientation="vertical"
      />
      <InfoValue
        className={isActive ? "text-brand-default" : "text-action-alert"}
      >
        {isActive ? t("person.labels.active") : t("person.labels.inactive")}
      </InfoValue>
    </div>
  );
};

export default PersonMetaHeader;
