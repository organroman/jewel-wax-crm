import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import { getAllFinanceColumns } from "./all-finance-columns";

const AllFinance = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const columns = getAllFinanceColumns(t);

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useFinance.getAllFinance({
    query,
    enabled: ready && (currentTabParam === "all" || !currentTabParam),
  });

  const { data: finance = [], total = 0 } = data ?? {};

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-4">
      <DataTable
        columns={columns}
        data={finance}
        isLoading={isLoading}
        totalItems={total}
        currentLimit={limit}
        currentPage={page}
        onPageChange={(newPage) => setParam("page", newPage)}
      />
    </div>
  );
};

export default AllFinance;
