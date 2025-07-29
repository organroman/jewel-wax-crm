import { useTranslation } from "react-i18next";

import { useFinance } from "@/api/finance/use-finance";

import { DataTable } from "@/components/shared/data-table";
import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import { getOrderPaymentsColumns } from "./order-payments-columns";

interface OrderPaymentsProps {
  orderId: number;
  orderAmount: number;
}

const OrderPayments = ({ orderId, orderAmount }: OrderPaymentsProps) => {
  const { t } = useTranslation();
  const columns = getOrderPaymentsColumns(t);

  const {
    data: payments = [],
    isLoading,
    error,
  } = useFinance.getInvoicesByOrderId({
    orderId,
    enabled: Boolean(orderId),
  });

  const paidInvoices = payments.filter((p) => p.status === "paid");
  const paidAmount = paidInvoices.reduce(
    (acc, invoice) => acc + Number(invoice.amount || 0),
    0
  );

  const debt = orderAmount - paidAmount;

  return (
    <div className="h-full flex flex-col p-5 bg-ui-sidebar gap-5">
      <div className="w-full flex items-center justify-between">
        <h3 className="font-semibold text-text-regular text-xl">
          {t("finance.payment")}
        </h3>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <InfoLabel className="text-sm text-text-regular">
              {t("finance.paid")}, ₴
            </InfoLabel>
            <InfoValue className="text-sm text-action-plus">
              {paidAmount}
            </InfoValue>
          </div>
          <div className="flex items-center gap-2.5">
            <InfoLabel className="text-sm text-text-regular">
              {t("finance.debt")}, ₴
            </InfoLabel>
            <InfoValue className="text-sm font-semibold text-action-minus">
              {debt}
            </InfoValue>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <DataTable
          columns={columns}
          data={payments}
          isLoading={isLoading}
          totalItems={payments.length}
          enablePagination={false}
        />
      </div>
    </div>
  );
};

export default OrderPayments;
