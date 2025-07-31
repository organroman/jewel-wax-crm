"use client";
import { FilterGroup, TabOption } from "@/types/shared.types";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useDialog } from "@/hooks/use-dialog";

import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";

import Toolbar from "@/components/shared/tool-bar";
import Modal from "@/components/shared/modal/modal";
import CreateInvoice from "@/components/shared/create-invoice";
import CustomTabs from "@/components/shared/custom-tabs";
import AllFinance from "@/components/finance/all-finance/all-finance";

import { FINANCE_TYPE } from "@/constants/finance.constants";
import { FINANCE_SORT_FIELDS } from "@/constants/sortable-fields";

const FinanceClient = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

    const {
      dialogOpen: expensesDialogOpen,
      setDialogOpen: expensesSetDialogOpen,
    } = useDialog();

  const tabsOptions = FINANCE_TYPE.map((type) => ({
    value: type,
    label: t(`finance.types.${type}`),
  }));

  const tabParam = searchParams.get("type");
  const currentTab = tabsOptions?.find((t) => t.value === tabParam) ?? {
    value: "all",
    label: t("finance.types.all"),
  };
  const [selectedTab, setSelectedTab] = useState<TabOption>(currentTab);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!selectedTab || selectedTab.value === value) return;

    const selected = tabsOptions.find((t) => t.value === value);
    if (!selected) {
      return;
    }
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
    setSelectedTab(selected);
  };

  const sortOptions = FINANCE_SORT_FIELDS.map((option) => ({
    value: option,
    label: t(`finance.sorting.${option}`),
  }));

  const filters: FilterGroup[] = []; // TODO: Define filters and add here

  return (
    <div className="h-full flex flex-col">
      <CustomTabs
        tabsOptions={tabsOptions}
        handleChange={handleChange}
        selectedTab={selectedTab}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <Toolbar
        sortOptions={sortOptions}
        searchPlaceholder={t("finance.placeholders.search")}
        addLabel={t("finance.add_expenses")}
        filterPlaceholder={t("placeholders.filter")}
        filterOptions={filters}
        showFilterButton={filters.length > 0}
        onAdd={() => expensesSetDialogOpen(true)}
        extraAction={<CreateInvoice />}
      />
      {selectedTab.value === "all" && <AllFinance />}
      <Dialog open={expensesDialogOpen} onOpenChange={expensesSetDialogOpen}>
        <Modal>add expenses</Modal>
      </Dialog>
    </div>
  );
};

export default FinanceClient;
