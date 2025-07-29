import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useActivityLog } from "@/api/activity-logs/use-activity-log";

import ChangesHistoryTable from "../shared/changes-history-table";

interface OrderChangesHistoryProps {
  orderId: number;
  orderNumber: number;
}

const OrderChangesHistory = ({
  orderId,
  orderNumber,
}: OrderChangesHistoryProps) => {
  const { t } = useTranslation();
  const query = `target=order&targetId=${orderId}`;

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

  return (
    <ChangesHistoryTable
      titleLabel={t("order.order_changes")}
      titleValue={`№ ${orderNumber.toString()}`}
      logs={data}
      titleValueClassName="text-action-plus underline"
    />
  );
};

export default OrderChangesHistory;
