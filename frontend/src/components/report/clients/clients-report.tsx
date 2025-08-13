import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useReport } from "@/api/report/use-report";
import { useQueryParams } from "@/hooks/use-query-params";

import TopBar from "../top-bar";
import { DataTable } from "@/components/shared/data-table";
import { getClientsReportColumns } from "./clients-report-columns";
import { usePerson } from "@/api/person/use-person";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { getFullName } from "@/lib/utils";

const ClientsReport = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const { page, limit, query, setParam, ready } = useQueryParams();
  const columns = getClientsReportColumns(t);

  const { data, isLoading } = useReport.getClientsReport({
    query: query,
    enabled: ready && (currentTabParam === "clients" || !currentTabParam),
  });

  const { data: customersList, isLoading: customersIsLoading } =
    usePerson.getCustomers(
      `role=client&search=${searchQuery}`,
      currentTabParam === "clients" || !currentTabParam
    );

  const {
    data: clients = [],
    total = 0,
    total_clients = 0,
    active_clients = 0,
    new_clients = 0,
    total_debtors = 0,
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
      value: total_debtors,
      color: "text-action-minus",
    },
  ];
  return (
    <div className="flex flex-col mt-2 lg:mt-8">
      <TopBar
        indicators={reportIndicators}
        setPersonSearchQuery={setSearchQuery}
        debouncedSetSearch={debouncedSetSearch}
        persons={
          customersList?.data.map((c) => {
            return {
              id: c.id,
              fullname: getFullName(c.first_name, c.last_name, c.patronymic),
            };
          }) ?? []
        }
        isLoading={customersIsLoading}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-4 lg:mt-8">
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
