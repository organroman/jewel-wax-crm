import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import { getClientPaymentsColumns } from "./client-payments-columns";


const ClientPayments = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const columns = getClientPaymentsColumns(t);

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useFinance.getAllClientPayments({
    query,
    enabled: ready && currentTabParam === "client_payment",
  });

  const { data: clientPayments = [], total = 0 } = data ?? {};

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-4">
      <DataTable
        columns={columns}
        data={clientPayments}
        isLoading={isLoading}
        totalItems={total}
        currentLimit={limit}
        currentPage={page}
        onPageChange={(newPage) => setParam("page", newPage)}
      />
    </div>
  );
};

export default ClientPayments;
