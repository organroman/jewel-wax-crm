import dayjs from "dayjs";

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
  return (
    <div className="flex items-center gap-2.5">
      <InfoLabel>Дата створення:</InfoLabel>
      <InfoValue> {dayjs(createdAt).format("DD.MM.YYYY")}</InfoValue>
      <InfoValue className="text-action-alert">ID: {id}</InfoValue>
      <Separator
        className="bg-ui-border data-[orientation=vertical]:h-[12px] w-[1px] "
        orientation="vertical"
      />
      <InfoValue
        className={isActive ? "text-brand-default" : "text-action-alert"}
      >
        {isActive ? "Активний" : "Неактивний"}
      </InfoValue>
    </div>
  );
};

export default PersonMetaHeader;
