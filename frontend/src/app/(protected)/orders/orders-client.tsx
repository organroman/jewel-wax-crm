"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/orders/use-order";
import { useEnumStore } from "@/stores/use-enums-store";

import { useQueryParams } from "@/hooks/use-query-params";

import { DataTable } from "@/components/shared/data-table";
import TabsFilter from "@/components/shared/tabs-filter";
import Toolbar from "@/components/shared/tool-bar";

import { getOrdersColumns } from "@/components/orders/orders-columns";
import { Separator } from "@/components/ui/separator";

import ERROR_MESSAGES from "@/constants/error-messages";
import {
  ORDER_STAGES,
  STATIC_ORDER_FILTERS,
} from "@/constants/orders.constants";

import { translateFilterGroups } from "@/lib/translate-constant-labels";


const OrdersClient = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const sortFields = useEnumStore((s) => s.getByType("order_sort_fields"));

  const sortOptions = sortFields.map((opt) => ({
    ...opt,
    label: t(`order.sorting.${opt.value}`),
  }));

  const tabsOptions = [
    ...ORDER_STAGES.map((order) => ({
      ...order,
      label: t(`order.tabs.${order.key}`),
    })),
  ];

  const filters = translateFilterGroups(
    STATIC_ORDER_FILTERS,
    t,
    "order.filters"
  );

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useOrder.getPaginatedOrders({
    query,
    enabled: ready,
  });

  const { data: orders = [], total = 0 } = data ?? {};

  const userRole: string = "super_admin"; // TODO: replace with actual logic

  const hiddenColumns = userRole === "modeller" ? ["customer"] : [];
  const ordersColumns = getOrdersColumns(t, hiddenColumns);

  if (error) {
    return <p>{ERROR_MESSAGES.SOMETHING_WENT_WRONG}</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <TabsFilter param="active_stage" options={tabsOptions} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <Toolbar
        sortOptions={sortOptions}
        searchPlaceholder={t("order.placeholders.search")}
        addLabel={t("order.add_order")}
        filterPlaceholder={t("placeholders.filters")}
        filterOptions={filters}
        onAdd={() => router.push("orders/new")}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-4">
        <DataTable
          columns={ordersColumns}
          data={orders}
          isLoading={isLoading}
          totalItems={total}
          currentLimit={limit}
          currentPage={page}
          onPageChange={(newPage) => setParam("page", newPage)}
        />
      </div>
    </div>
  );
};

export default OrdersClient;
