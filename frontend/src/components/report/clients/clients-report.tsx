import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useReport } from "@/api/report/use-report";
import { useQueryParams } from "@/hooks/use-query-params";

import TopBar from "../top-bar";
import { DataTable } from "@/components/shared/data-table";
import { getClientsReportColumns } from "./clients-report-columns";

const ClientsReport = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const { page, limit, query, setParam, ready } = useQueryParams();
  const columns = getClientsReportColumns(t);

  const { data, isLoading } = useReport.getClientsReport({
    query: query,
    enabled: ready && (currentTabParam === "clients" || !currentTabParam),
  });

  const {
    data: clients = [],
    total = 0,
    total_clients = 0,
    active_clients = 0,
    new_clients = 0,
    clients_debt = 0,
  } = data ?? {};

  const reportIndicators = [
    {
      label: t("report.clients.total"),
      value: total_clients,
      color: "text-brand-dark",
    },
    {
      label: t("report.clients.active"),
      value: active_clients,
      color: "text-brand-dark",
    },
    {
      label: t("report.clients.new"),
      value: new_clients,
      color: "text-brand-default",
    },
    {
      label: t("report.clients.debtors"),
      value: clients_debt,
      color: "text-action-minus",
    },
  ];
  return (
    <div className="flex flex-col mt-8">
      <TopBar
        indicators={reportIndicators}
        enabled={currentTabParam === "clients" || !currentTabParam}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-8">
        <DataTable
          columns={columns}
          data={clients}
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

export default ClientsReport;
