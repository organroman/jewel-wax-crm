import { ActivityLog } from "@/types/activity-log.types";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface ChangesHistoryTableProps {
  titleLabel: string;
  titleValue: string;
  logs: ActivityLog[];
  titleValueClassName?: string;
}

const ChangesHistoryTable = ({
  titleLabel,
  titleValue,
  logs,
  titleValueClassName,
}: ChangesHistoryTableProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full bg-ui-sidebar overflow-hidden rounded-md p-4 flex flex-col">
      <div className="flex items-center pb-4.5 border-b border-ui-border rounded-sm gap-2">
        <p>{titleLabel}:</p>
        <p
          className={cn(
            "font-semibold text-brand-default",
            titleValueClassName
          )}
        >
          {titleValue}
        </p>
      </div>
      <div className="flex flex-col w-full flex-1 h-full overflow-auto border border-ui-border mt-10">
        {logs.map((item) => (
          <div
            key={item.id}
            className="min-w-fit overflow-x-visible gap-10 lg:gap-0 flex flex-row items-center justify-between  even:bg-ui-row-even  odd:bg-ui-row-odd py-3 px-2.5 border-b border-ui-border "
          >
            <div className="flex min-w-fit whitespace-nowrap items-center gap-4 lg:w-3/4">
              <p className="text-xs text-text-muted">
                {t("log_actions.date")}:
              </p>
              <p className="text-xs text-text-muted">
                {dayjs(item.created_at).format("DD.MM.YYYY/HH:MM")}
              </p>
              <p className="text-sm font-medium">
                {t(`log_actions.${item.action}`)}
              </p>
            </div>
            <div className="flex items-center min-w-fit whitespace-nowrap gap-2.5">
              <p className="text-xs text-action-alert ">ID {item.actor_id}</p>
              <p className="text-sm text-text-muted">{item.actor_fullname}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangesHistoryTable;
