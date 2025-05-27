import { useActivityLog } from "@/api/activity-logs/use-activity-log";
import React from "react";

interface PersonChangesHistoryProps {
  id: number;
}

const PersonChangesHistory = ({ id }: PersonChangesHistoryProps) => {
  const query = `target=person&targetId=${id}`;

  const { data, isLoading, error } = useActivityLog.getLogsByTargetAndId({
    query,
  });

  console.log(data);
  return (
    <div className="h-full w-full bg-white overflow-hidden rounded-md p-4 flex flex-col">
      PersonChangesHistory
    </div>
  );
};

export default PersonChangesHistory;
