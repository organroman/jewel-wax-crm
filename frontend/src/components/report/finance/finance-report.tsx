import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useReport } from "@/api/report/use-report";

import TopBar from "../top-bar";

import { DataTable } from "@/components/shared/data-table";
import { getFinanceReportColumns } from "./finance-report.columns";

import { translateKeyValueList } from "@/lib/translate-constant-labels";

import { FINANCE_REPORT_DATA_TYPE } from "@/constants/enums.constants";

const FinanceReport = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");
  const currentDataType = searchParams.get("data_type");

  const { page, limit, query, setParam, ready } = useQueryParams();
  const columns = getFinanceReportColumns(t);

  const { data, isLoading } = useReport.getFinanceReport({
    query: query,
    enabled: ready && currentTabParam === "financial",
  });

  const dataTypes = FINANCE_REPORT_DATA_TYPE.map((c) => ({
    key: c,
    value: c,
  }));

  const options = translateKeyValueList(
    dataTypes,
    t,
    "report.finance.data_types"
  );

  const {
    data: orders = [],
    total = 0,
    total_actual_income = 0,
    total_debt = 0,
    total_expenses = 0,
    total_profit = 0,
    total_profitability = 0,
  } = data ?? {};

  const reportIndicators = [
    {
      label: t("report.finance.income"),
      value: total_actual_income?.toFixed(2) ?? 0.0,
      color: "text-brand-default",
    },
    {
      label: t("report.finance.debt"),
      value: total_debt?.toFixed(2) ?? 0.0,
      color: "text-action-minus",
    },
    {
      label: `${t("report.finance.expenses")}`,
      value: total_expenses.toFixed(2) ?? 0.0,
      // color: "text-accent-peach",
      color: "text-default-dark",
    },
    {
      label: `${t("report.finance.profit")}`,
      value: total_profit.toFixed(2) ?? null,
      color: "text-action-plus",
    },
    {
      label: `${t("report.finance.profitability")}`,
      value: `${total_profitability?.toFixed(2)}%`,
      color: "text-brand-dark",
    },
  ];

  return (
    <div className="flex flex-col mt-8">
      <TopBar
        indicators={reportIndicators}
        selectOptions={options}
        selectPlaceholder={t("report.finance.all_data_types")}
        filterLabel={t("report.finance.data_type")}
        paramOfSelect={"data_type"}
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

export default FinanceReport;
