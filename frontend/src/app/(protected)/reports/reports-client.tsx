"use client";
import { PersonRoleValue } from "@/types/person.types";
import { TabOption } from "@/types/shared.types";

import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import CustomTabs from "@/components/shared/custom-tabs";
import { Separator } from "@/components/ui/separator";
import ClientsReport from "@/components/report/clients/clients-report";
import ModelingReport from "@/components/report/modeling/modeling-report";
import ExpensesReport from "@/components/report/expenses/expenses-report";
import FinanceReport from "@/components/report/finance/finance-report";
import OrdersReport from "@/components/report/orders/orders-report";

import { REPORT_TYPE } from "@/constants/report.constants";

interface ReportsClientProps {
  role: PersonRoleValue;
}

const ReportsClient = ({ role }: ReportsClientProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabsOptions = REPORT_TYPE.filter((t) =>
    t.permission.includes(role)
  ).map((type) => ({
    value: type.key,
    label: t(`report.types.${type.key}`),
  }));

  const tabParam = searchParams.get("type");
  const currentTab = tabsOptions?.find((t) => t.value === tabParam) ?? {
    value: tabsOptions[0].value,
    label: t(`report.types.${tabsOptions[0].value}`),
  };
  const [selectedTab, setSelectedTab] = useState<TabOption>(currentTab);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!selectedTab || selectedTab.value === value) return;

    const selected = tabsOptions.find((t) => t.value === value);
    if (!selected) {
      return;
    }
    params.set("type", value);
    params.delete("from");
    params.delete("to");
    router.replace(`?${params.toString()}`);
    setSelectedTab(selected);
  };

  return (
    <div className="h-full flex flex-col">
      <CustomTabs
        tabsOptions={tabsOptions}
        handleChange={handleChange}
        selectedTab={selectedTab}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      {selectedTab.value === "clients" && <ClientsReport role={role} />}
      {selectedTab.value === "modeling" && <ModelingReport role={role} />}
      {selectedTab.value === "orders" && <OrdersReport role={role} />}
      {selectedTab.value === "expenses" && <ExpensesReport role={role} />}
      {selectedTab.value === "financial" && <FinanceReport role={role} />}
    </div>
  );
};

export default ReportsClient;
