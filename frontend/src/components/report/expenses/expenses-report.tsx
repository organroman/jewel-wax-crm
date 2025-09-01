import { PersonRoleValue } from "@/types/person.types";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useReport } from "@/api/report/use-report";

import TopBar from "../top-bar";

import { DataTable } from "@/components/shared/data-table";
import { getExpensesReportColumns } from "./expenses-report.columns";

import { translateKeyValueList } from "@/lib/translate-constant-labels";

import { EXPENSE_CATEGORY } from "@/constants/enums.constants";

const ExpensesReport = ({ role }: { role: PersonRoleValue }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const { page, limit, query, setParam, ready } = useQueryParams();
  const columns = getExpensesReportColumns(t);

  const { data, isLoading } = useReport.getExpensesReport({
    query: query,
    enabled: ready && currentTabParam === "expenses",
  });

  const expenses = EXPENSE_CATEGORY.map((c) => ({ key: c, value: c }));

  const options = translateKeyValueList(
    expenses,
    t,
    "finance.expenses_category"
  );

  const {
    data: orders = [],
    total = 0,
    total_expenses_amount = 0,
    total_modelling_exp_amount = 0,
    total_printing_exp_amount = 0,
    total_materials_exp_amount = 0,
    total_other_exp_amount = 0,
  } = data ?? {};

  const reportIndicators = [
    {
      label: t("report.expenses.total"),
      labelShort: t("report.expenses.total_short"),
      value: total_expenses_amount?.toFixed(2) ?? null,
      color: "text-action-minus",
    },
    {
      label: t("report.expenses.modeling"),
      labelShort: t("report.expenses.modeling"),
      value: total_modelling_exp_amount?.toFixed(2) ?? null,
      color: "text-action-plus",
    },
    {
      label: `${t("report.expenses.printing")}`,
      labelShort: t("report.expenses.printing"),
      value: total_printing_exp_amount.toFixed(2) ?? null,
      // color: "text-accent-peach",
      color: "text-accent-violet",
    },
    {
      label: `${t("report.expenses.materials")}`,
      labelShort: `${t("report.expenses.materials")}`,
      value: total_materials_exp_amount.toFixed(2) ?? null,
      color: "text-brand-dark",
    },
    {
      label: `${t("report.expenses.other")}`,
      labelShort: `${t("report.expenses.other_short")}`,
      value: total_other_exp_amount.toFixed(2) ?? null,
      color: "text-brand-dark",
    },
  ];

  return (
    <div className="flex flex-col mt-8">
      <TopBar
        indicators={reportIndicators}
        selectOptions={options}
        selectPlaceholder={t("report.expenses.all_expenses")}
        filterLabel={t("finance.expenses_type")}
        paramOfSelect={"expenses_category"}
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

export default ExpensesReport;
