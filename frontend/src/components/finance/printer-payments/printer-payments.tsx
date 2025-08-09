import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import { getPrinterPaymentsColumns } from "./printer-payments-columns";

const PrinterPayments = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("type");

  const columns = getPrinterPaymentsColumns(t);

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useFinance.getAllPrinterPayments({
    query,
    enabled: ready && currentTabParam === "print_payment",
  });

  const { data: printerPayments = [], total = 0 } = data ?? {};

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-4">
      <DataTable
        columns={columns}
        data={printerPayments}
        isLoading={isLoading}
        totalItems={total}
        currentLimit={limit}
        currentPage={page}
        onPageChange={(newPage) => setParam("page", newPage)}
        // headerBg="bg-accent-yellow"
        headerBg="bg-accent-purple"
      />
    </div>
  );
};

export default PrinterPayments;
