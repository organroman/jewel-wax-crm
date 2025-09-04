"use client";

import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

import { useStatistic } from "@/api/statistic/use-statistic";

import CustomTabs from "@/components/shared/custom-tabs";
import IndicatorsList from "@/components/statistic/indicator-list";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/statistic/header";
import OrdersChart from "@/components/statistic/orders-chart";

import OrderIcon from "../../../assets/icons/orders.svg";
import PeopleIcon from "../../../assets/icons/people.svg";
import DollarIcon from "../../../assets/icons/dollar-square.svg";
import ChartIcon from "../../../assets/icons/chart.svg";

const StatisticClient = () => {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { data, isLoading } = useStatistic.getStatistic({
    query: `${params.toString()}`,
    enabled: true,
  });
  console.log("🚀 ~ data:", data);

  const tabsOptions = [
    {
      value: "statistic",
      label: t(`statistic.stat`),
    },
  ];

  const indicatorsData = [
    {
      amount: data?.totalOrders,
      label: t("statistic.total_orders"),
      icon: OrderIcon,
      currencySign: false,
    },
    {
      amount: data?.totalOrdersAmount,
      label: t("statistic.total_orders_amount"),
      icon: DollarIcon,
      currencySign: true,
    },
    {
      amount: data?.totalCustomers,
      label: t("statistic.total_customers"),
      icon: PeopleIcon,
      currencySign: false,
    },
    {
      amount: data?.averageProcessingPeriod,
      label: t("statistic.average_days"),
      icon: ChartIcon,
      currencySign: false,
    },
  ];

  if (isLoading) {
    <div className="flex flex-col h-full w-full items-center justify-center">
      <Loader className="size-6 text-brand-default animate-spin" />
    </div>;
  }

  if (!data) {
    return <div>something went wrong</div>;
  }
  return (
    <div className="flex flex-col">
      <CustomTabs tabsOptions={tabsOptions} selectedTab={tabsOptions[0]} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="flex gap-6 h-full w-full flex-col">
        <Header />
        <IndicatorsList indicatorsData={indicatorsData} />
        <OrdersChart series={data.series} totalsByStage={data.totalsByStage} />
      </div>
    </div>
  );
};

export default StatisticClient;
