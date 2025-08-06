"use client";
import { PersonRoleValue } from "@/types/person.types";
import { TabOption } from "@/types/shared.types";

import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import CustomTabs from "@/components/shared/custom-tabs";
import { Separator } from "@/components/ui/separator";
import ClientsReport from "@/components/report/clients/clients-report";

import { REPORT_TYPE } from "@/constants/report.constants";

interface ReportsClientProps {
  role: PersonRoleValue;
}

const ReportsClient = ({ role }: ReportsClientProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  //todo: role based permission

  const tabsOptions = REPORT_TYPE.map((type) => ({
    value: type,
    label: t(`report.types.${type}`),
  }));

  const tabParam = searchParams.get("type");
  const currentTab = tabsOptions?.find((t) => t.value === tabParam) ?? {
    value: "clients",
    label: t("report.types.clients"),
  };
  const [selectedTab, setSelectedTab] = useState<TabOption>(currentTab);

  const handleChange = (value: string) => {
    console.log(value);
    const params = new URLSearchParams(searchParams);
    if (!selectedTab || selectedTab.value === value) return;

    const selected = tabsOptions.find((t) => t.value === value);
    console.log(selected);
    if (!selected) {
      return;
    }
    params.set("type", value);
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
      {selectedTab.value === "clients" && <ClientsReport />}
    </div>
  );
};

export default ReportsClient;
