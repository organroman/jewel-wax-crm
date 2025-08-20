import { ActiveStageCount } from "@/types/dashboard.types";

import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Separator } from "../ui/separator";

import InfoLabel from "../shared/typography/info-label";

import ReadinessChart from "./readiness-chart";
import ReadinessItemIndicator from "./readiness-item-indicator";

interface OrderReadinessIndicatorProps {
  totalOrders: number;
  stagesStatusCount: ActiveStageCount[];
}

const OrderReadinessIndicator = ({
  totalOrders,
  stagesStatusCount,
}: OrderReadinessIndicatorProps) => {
  const { t } = useTranslation();
  const clarification = stagesStatusCount.find(
    (s) => s.active_stage_status === "clarification"
  );
  const negotiation = stagesStatusCount.find(
    (s) => s.active_stage_status === "negotiation"
  );
  const inProcess = stagesStatusCount.find(
    (s) => s.active_stage_status === "in_process"
  );

  const processed = stagesStatusCount.find(
    (s) => s.active_stage_status === "processed"
  );

  return (
    <div className="flex flex-1 flex-row px-7 gap-6 items-center border border-ui-border bg-ui-sidebar rounded-sm">
      <div className="flex flex-1 flex-col gap-9">
        <div className="flex w-full justify-between items-center">
          <p className="font-bold text-base/5 whitespace-pre-wrap">
            {t("dashboard.order_readiness")}
          </p>
          <InfoLabel className="">
            {dayjs(new Date()).format("DD.MM.YYYY")}
          </InfoLabel>
        </div>
        <div className="w-full flex flex-col gap-2">
          <InfoLabel className="">{`${t(
            "dashboard.total_orders"
          )}: ${totalOrders} `}</InfoLabel>
          <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
          <div className="flex items-center justify-between">
            <ReadinessItemIndicator
              label={t("order.stage_statuses.clarification")}
              value={clarification?.count ?? 0}
              labelColor="text-action-plus"
            />
            <ReadinessItemIndicator
              label={t("order.stage_statuses.negotiation")}
              value={negotiation?.count ?? 0}
              labelColor="text-accent-red"
            />
            <ReadinessItemIndicator
              label={t("order.stage_statuses.in_process")}
              value={inProcess?.count ?? 0}
              labelColor="text-accent-blue"
            />

            <ReadinessItemIndicator
              label={t("order.stage_statuses.processed")}
              value={processed?.count ?? 0}
              labelColor="text-brand-default"
            />
          </div>
        </div>
      </div>
      <ReadinessChart
        negotiation={negotiation?.count ?? 0}
        processed={processed?.count ?? 0}
        inProcess={inProcess?.count ?? 0}
        clarification={clarification?.count ?? 0}
      />
    </div>
  );
};

export default OrderReadinessIndicator;
