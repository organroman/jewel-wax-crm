import { PersonRoleValue } from "@/types/person.types";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useReport } from "@/api/report/use-report";

import TopBar from "../top-bar";

import { getOrdersReportColumns } from "./orders-report.columns";
import { DataTable } from "@/components/shared/data-table";

import { translateKeyValueList } from "@/lib/translate-constant-labels";

import { STAGE_STATUSES } from "@/constants/orders.constants";

const OrdersReport = ({ role }: { role: PersonRoleValue }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const { page, limit, query, setParam, ready } = useQueryParams();
  const columns = getOrdersReportColumns(t);

  const { data, isLoading } = useReport.getOrdersReport({
    query: query,
    enabled: ready && currentTabParam === "orders",
  });

  const statuses = STAGE_STATUSES.map((c) => ({ key: c, value: c }));

  const options = translateKeyValueList(statuses, t, "order.stage_statuses");

  const {
    data: orders = [],
    total = 0,
    total_orders = 0,
    total_in_process = 0,
    total_done = 0,
    total_problem = 0,
  } = data ?? {};

  const reportIndicators = [
    {
      label: t("report.orders.total"),
      labelShort: t("report.orders.total_short"),
      value: total_orders ?? null,
      color: "text-brand-default",
    },
    {
      label: t("report.orders.in_process"),
      labelShort: t("report.orders.in_process"),
      value: total_in_process ?? null,
      color: "text-brand-dark",
    },
    {
      label: `${t("report.orders.done")}`,
      labelShort: t("report.orders.done"),
      value: total_done ?? null,
      color: "text-brand-dark",
    },
    {
      label: `${t("report.orders.problem")}`,
      labelShort: `${t("report.orders.problem")}`,
      value: total_problem ?? null,
      color: "text-action-minus",
    },
  ];

  return (
    <div className="flex flex-col mt-8">
      <TopBar
        indicators={reportIndicators}
        selectOptions={options}
        selectPlaceholder={t("report.orders.all_stage_statuses")}
        filterLabel={t("report.orders.status")}
        paramOfSelect={"active_stage_status"}
        role={role}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-8">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          totalItems={total}
          currentLimit={limit}
          currentPage={page}
          onPageChange={(newPage) => setParam("page", newPage)}
        />
      </div>
    </div>
  );
};

export default OrdersReport;
