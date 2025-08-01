import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useActivityLog } from "@/api/activity-logs/use-activity-log";

import ChangesHistoryTable from "../shared/changes-history-table";

import { getFullName } from "@/lib/utils";

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
    <ChangesHistoryTable
      titleLabel={t("person.person_changes")}
      titleValue={personFullname}
      logs={data}
    />
  );
};

export default PersonChangesHistory;
