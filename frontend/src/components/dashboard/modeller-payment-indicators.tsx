import { PaymentStatus } from "@/types/finance.types";
import { PaymentsByStatusCount } from "@/types/dashboard.types";

import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";

import { cn } from "@/lib/utils";

interface ModellerPaymentIndicatorsProps {
  totalModelingPaymentsAmountByStatus: PaymentsByStatusCount;
}

const ModellerPaymentIndicators = ({
  totalModelingPaymentsAmountByStatus,
}: ModellerPaymentIndicatorsProps) => {
  const { t } = useTranslation();

  const totalAmount =
    totalModelingPaymentsAmountByStatus.unpaid +
    totalModelingPaymentsAmountByStatus.paid +
    totalModelingPaymentsAmountByStatus.partly_paid;

  const paymentsArr = Object.entries(totalModelingPaymentsAmountByStatus).map(
    ([status, value]) => ({ status, value })
  );

  const paymentsWithoutNull = paymentsArr.filter((p) => p.value !== 0);

  return (
    <div className="flex flex-col p-7 gap-6 items-center border border-ui-border bg-ui-sidebar rounded-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <p className="font-bold text-sm leading-4">
            {t("dashboard.payment_status")}
          </p>
          <p className="text-sm text-text-muted leading-4">
            {t("order.stages.modeling")}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex flex-row gap-2.5">
            <InfoLabel className="text-sm">
              {t("dashboard.total_amount")}:
            </InfoLabel>
            <InfoValue className="font-bold text-sm">
              {totalAmount.toFixed(2)}₴
            </InfoValue>
          </div>
          <InfoLabel className="text-xs">
            {dayjs(new Date()).format("DD.MM.YYYY")}
          </InfoLabel>
        </div>
      </div>
      <div className="w-full h-4 flex flex-row rounded-sm mb-5">
        {paymentsWithoutNull.map((p) => {
          const colors = {
            unpaid: "bg-accent-red",
            paid: "bg-brand-default",
            partly_paid: "bg-action-plus",
          };

          return (
            <div
              key={p.status}
              style={{ width: `${(p.value / totalAmount) * 100}%` }}
              className={cn(
                `h-full first:rounded-l-sm last:rounded-r-sm relative`,
                colors[p.status as PaymentStatus]
              )}
            >
              <div className="flex flex-row gap-2 absolute left-5 -bottom-5">
                <InfoLabel>{t(`dashboard.${p.status}`)}</InfoLabel>
                <InfoValue>{p.value.toFixed(2)}₴</InfoValue>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModellerPaymentIndicators;
