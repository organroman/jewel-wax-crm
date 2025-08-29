"use client";

import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import { useUnreadStore } from "@/stores/use-unread-store";
import { useDashboard } from "@/api/dashboard/use-dashboard";

import CustomTabs from "@/components/shared/custom-tabs";
import { Separator } from "@/components/ui/separator";

import NewRequestIndicators from "@/components/dashboard/new-request-indicators";
import ModellerIndicators from "@/components/dashboard/modeller-indicators";
import NewNotificationIndicators from "@/components/dashboard/new-notification-indicators";
import OrderReadinessIndicator from "@/components/dashboard/order-readiness-indicators";
import TodaysOrderIndicators from "@/components/dashboard/todays-order-indicators";
import MarkedOrderIndicators from "@/components/dashboard/marked-order-indicators";
import FinanceIndicators from "@/components/dashboard/finance-indicators";
import ModellerPaymentIndicators from "@/components/dashboard/modeller-payment-indicators";

import { splitUnread } from "@/lib/split-unread";

const DashboardClient = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboard.getAll({ enabled: true });
  const { byConversation } = useUnreadStore((s) => s);

  const badges = splitUnread(byConversation);

  const tabsOptions = [
    {
      value: "dashboard",
      label: t(`dashboard.dashboard`),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-brand-default" />
      </div>
    );
  }

  if (!data) {
    return "No data";
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <CustomTabs tabsOptions={tabsOptions} selectedTab={tabsOptions[0]} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="flex gap-6 h-full w-full mt-7 overflow-hidden">
        <div className="h-fll flex flex-col w-[300px] gap-2.5">
          <TodaysOrderIndicators
            totalOrders={data?.totalOrders}
            totalDelivery={data.totalDelivery}
            totalMilling={data.totalMilling}
            totalModeling={data.totalModeling}
            totalPrinting={data.totalPrinting}
          />
          <NewRequestIndicators total={badges.externalChannels} />
          <NewNotificationIndicators total={badges.internalTotal} />
          <ModellerIndicators
            modellersCounts={data.modellersCounts}
            totalModeling={data.totalModeling}
          />
        </div>
        <div className="h-full flex flex-col gap-2.5 flex-1">
          <div className="flex flex-row gap-6">
            <OrderReadinessIndicator
              totalOrders={data.totalOrders}
              stagesStatusCount={data.stagesStatusCount}
            />
            <MarkedOrderIndicators
              totalProblemOrders={data.totalProblemOrders}
              totalImportantOrders={data.totalImportantOrders}
              totalFavoriteOrders={data.totalFavoriteOrders}
            />
          </div>
          <FinanceIndicators
            totalPaymentsAmountByStatus={data.totalPaymentsAmountByStatus}
            planedExpenses={data.planedExpenses}
            planedIncome={data.planedIncome}
            planedProfit={data.planedProfit}
            planedProfitability={data.planedProfitability}
            actualExpenses={data.actualExpenses}
            actualIncome={data.actualIncome}
            actualProfit={data.actualProfit}
          />
          <ModellerPaymentIndicators
            totalModelingPaymentsAmountByStatus={
              data.totalModelingPaymentsAmountByStatus
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
