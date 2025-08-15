import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";

import { useQueryParams } from "@/hooks/use-query-params";
import { useReport } from "@/api/report/use-report";
import { usePerson } from "@/api/person/use-person";

import TopBar from "../top-bar";
import { getModelingReportColumns } from "./modeling-report.columns";
import { DataTable } from "@/components/shared/data-table";

const ModelingReport = () => {
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
  const columns = getModelingReportColumns(t);

  const { data, isLoading } = useReport.getModelingReport({
    query: query,
    enabled: ready && (currentTabParam === "modeling" || !currentTabParam),
  });

  const { data: modellers, isLoading: modellersIsLoading } =
    usePerson.getPaginatedPersonsByRole(
      `role=modeller&search=${searchQuery}`,
      currentTabParam === "modeling" || !currentTabParam
    );

  const {
    data: orders = [],
    total = 0,
    total_modelling_cost = 0,
    total_modelling_debt = 0,
    total_modelling_paid = 0,
    total_orders = 0,
  } = data ?? {};
  const reportIndicators = [
    {
      label: t("report.modeling.total"),
      labelShort: t("report.modeling.total_short"),
      value: total_orders,
      color: "text-brand-default",
    },
    {
      label: t("report.modeling.amount"),
      labelShort: t("report.modeling.amount_short"),
      value: total_modelling_cost?.toFixed(2) ?? 0.0,
      color: "text-brand-dark",
    },
    {
      label: `${t("report.modeling.paid")},₴`,
      labelShort: t("report.modeling.paid"),
      value: total_modelling_paid.toFixed(2),
      color: "text-action-plus",
    },
    {
      label: `${t("report.modeling.unpaid")},₴`,
      labelShort: `${t("report.modeling.unpaid")}`,
      value: total_modelling_debt.toFixed(2),
      color: "text-action-minus",
    },
  ];

  return (
    <div className="flex flex-col mt-8">
      <TopBar
        indicators={reportIndicators}
        setPersonSearchQuery={setSearchQuery}
        debouncedSetSearch={debouncedSetSearch}
        persons={modellers?.data ?? []}
        isLoading={modellersIsLoading}
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

export default ModelingReport;
