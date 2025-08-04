import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import { getTransactionsColumns } from "./transactions-columns";

const Transactions = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const columns = getTransactionsColumns(t);

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useFinance.getTransactions({
    query,
    enabled: ready && currentTabParam === "history",
  });

  const { data: transactions = [], total = 0 } = data ?? {};

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-4">
      <DataTable
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        totalItems={total}
        currentLimit={limit}
        currentPage={page}
        onPageChange={(newPage) => setParam("page", newPage)}
      />
    </div>
  );
};

export default Transactions;
