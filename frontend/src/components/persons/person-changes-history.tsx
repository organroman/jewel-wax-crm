import { useActivityLog } from "@/api/activity-logs/use-activity-log";
import { getFullName } from "@/lib/utils";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface PersonChangesHistoryProps {
  id: number;
  lastName: string;
  firstName: string;
  patronymic?: string;
}

const PersonChangesHistory = ({
  id,
  lastName,
  firstName,
  patronymic,
}: PersonChangesHistoryProps) => {
  const { t } = useTranslation();
  const query = `target=person&targetId=${id}`;

  const { data, isLoading, error } = useActivityLog.getLogsByTargetAndId({
    query,
  });

  if (isLoading) {
    return (
      <div className="h-full w-full bg-ui-sidebar overflow-hidden rounded-md p-4 items-center justify-center">
        <Loader className="size-6 animate-spin text-brand-default" />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="h-full w-full bg-ui-sidebar overflow-hidden rounded-md p-4 items-center justify-center">
        <p>{error?.message || "something went wrong"}</p>
      </div>
    );
  }

  const personFullname = getFullName(firstName, lastName, patronymic);

  return (
    <div className="h-full w-full bg-ui-sidebar overflow-hidden rounded-md p-4 flex flex-col">
      <div className="flex items-center pb-4.5 border-b border-ui-border gap-2">
        <p>{t("person.person_changes")}:</p>
        <p className="font-semibold text-brand-default">{personFullname}</p>
      </div>
      <div className="flex flex-col w-full flex-1 h-full overflow-auto border border-ui-border mt-10">
        {data.map((item) => (
          <div
            key={item.id}
            className="min-w-fit overflow-x-visible gap-10 lg:gap-0 flex flex-row items-center justify-between odd:bg-ui-row-odd py-3 px-2.5 border-b border-ui-border "
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

export default PersonChangesHistory;
