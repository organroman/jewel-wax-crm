"use client";
import { PersonRoleValue } from "@/types/person.types";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/order/use-order";

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
import {
  getColumnVisibilityByRole,
  PERMISSIONS,
} from "@/constants/permissions.constants";

import { translateFilterGroups } from "@/lib/translate-constant-labels";
import { hasPermission } from "@/lib/utils";
import { ORDERS_SORT_FIELDS } from "@/constants/sortable-fields";

const OrdersClient = ({ userRole }: { userRole: PersonRoleValue }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const permission = hasPermission(PERMISSIONS.ORDERS.CREATE, userRole);

  const sortOptions = ORDERS_SORT_FIELDS.map((opt) => ({
    value: opt,
    label: t(`order.sorting.${opt}`),
  }));

  const tabsOptions =
    userRole === "super_admin"
      ? [
          ...ORDER_STAGES.map((stage) => ({
            value: stage,
            label: t(`order.active_stages.${stage}`),
          })),
        ]
      : [
          {
            value: ORDER_STAGES[0],
            label: t(`order.tabs.${ORDER_STAGES[0]}`),
          },
        ];

  const filters = translateFilterGroups(
    STATIC_ORDER_FILTERS.filter((f) => f.permission.includes(userRole)),
    t,
    "order.filters"
  );

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = useOrder.getPaginatedOrders({
    query,
    enabled: ready,
  });

  const { data: orders = [], total = 0, stage_counts } = data ?? {};

  const ordersColumns = getOrdersColumns(t, userRole);
  const columnVisibility = getColumnVisibilityByRole(
    userRole,
    searchParams.toString()
  );

  if (error) {
    return <p>{ERROR_MESSAGES.SOMETHING_WENT_WRONG}</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <TabsFilter
        param="active_stage"
        options={tabsOptions}
        counts={stage_counts}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <Toolbar
        sortOptions={sortOptions}
        searchPlaceholder={t("order.placeholders.search")}
        addLabel={t("order.add_order")}
        filterPlaceholder={t("placeholders.filters")}
        filterOptions={filters}
        showFilterButton={filters.length > 0}
        onAdd={permission ? () => router.push("orders/new") : undefined}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-4">
        <DataTable
          columns={ordersColumns}
          data={orders}
          isLoading={isLoading}
          totalItems={total}
          currentLimit={limit}
          currentPage={page}
          columnVisibility={columnVisibility}
          onPageChange={(newPage) => setParam("page", newPage)}
        />
      </div>
    </div>
  );
};

export default OrdersClient;
