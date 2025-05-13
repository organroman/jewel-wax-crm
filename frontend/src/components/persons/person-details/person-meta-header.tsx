import dayjs from "dayjs";

import { Separator } from "../../ui/separator";
import { cn } from "@/lib/utils";

interface PersonDetailsMetaHeaderProps {
  createdAt: Date;
  id: number;
  isActive: boolean;
}

const PersonMetaHeader = ({
  createdAt,
  id,
  isActive,
}: PersonDetailsMetaHeaderProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <p className="text-text-muted text-xs">
        Дата створення:{" "}
        <span className="text-black font-medium">
          {dayjs(createdAt).format("DD.MM.YYYY")}
        </span>
      </p>
      <span className="text-xs text-action-alert">ID: {id} </span>
      <Separator
        className="bg-ui-border data-[orientation=vertical]:h-[12px] w-[1px] "
        orientation="vertical"
      />
      <p
        className={cn(
          "text-xs font-medium",
          isActive ? "text-brand-default" : "text-action-alert"
        )}
      >
        {isActive ? "Активний" : "Неактивний"}
      </p>
    </div>
  );
};

export default PersonMetaHeader;
