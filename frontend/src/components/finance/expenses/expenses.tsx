import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import { getExpensesColumns } from "./expenses-columns";

const Expenses = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const columns = getExpensesColumns(t);

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useFinance.getAllExpenses({
    query,
    enabled: ready && currentTabParam === "expenses",
  });

  const { data: expenses = [], total = 0 } = data ?? {};

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-4">
      <DataTable
        columns={columns}
        data={expenses}
        isLoading={isLoading}
        totalItems={total}
        currentLimit={limit}
        currentPage={page}
        onPageChange={(newPage) => setParam("page", newPage)}
      />
    </div>
  );
};

export default Expenses;
