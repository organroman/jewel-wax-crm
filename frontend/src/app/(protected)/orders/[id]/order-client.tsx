"use client";

import { TabOption } from "@/types/shared.types";
import { PersonRoleValue } from "@/types/person.types";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { useOrder } from "@/api/order/use-order";
import { useUpload } from "@/api/upload/use-upload";
import { useOrderPermissions } from "@/hooks/use-order-permissions";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CustomTabs from "@/components/shared/custom-tabs";
import OrderCardHeader from "@/components/orders/order-card-header";
import OrderForm from "@/components/orders/form/order/order-form";
import OrderPayments from "@/components/orders/payments/order-payments";
import OrderChat from "@/components/orders/chat/order-chat";
import ChatItemEmpty from "@/components/orders/chat/chat-item-empty";
import OrderChangesHistory from "@/components/orders/order-changes-history";

import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";

const OrderClient = ({
  id,
  userId,
  role,
}: {
  id: number;
  userId: number;
  role: PersonRoleValue;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const {
    data: order,
    isLoading,
    error,
  } = useOrder.getById({ id, enabled: !!id });

  const { updateMutation } = useOrder.update({ queryClient, t });
  const { uploadImagesMutation } = useUpload.uploadImages();

  const tabParam = searchParams.get("tab");
  const permissions = useOrderPermissions(role, userId, order);

  const canViewOrder = permissions.hasExtraAccess("VIEW", "order");
  const canViewPayments = permissions.hasExtraAccess("VIEW", "payments");
  const canViewHistory = permissions.hasExtraAccess("VIEW", "changes_history");

  const tabs = translateKeyValueList(ORDER_CARD_TABS_LIST, t, "order.tabs")
    .filter((tab) => tab.value !== "new")
    .filter((tab) => {
      return permissions.hasExtraAccess("VIEW", tab.value);
    });

  useEffect(() => {
    if (!isLoading && !canViewOrder) {
      router.push("/orders");
    }
  }, [isLoading, canViewOrder, router]);

  const currentTab = tabs?.find((t) => t.value === tabParam) ?? {
    value: "order",
    label: t("order.tabs.order"),
  };

  const [selectedTab, setSelectedTab] = useState<TabOption>(currentTab);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!selectedTab || selectedTab.value === value) return;

    const selected = tabs.find((t) => t.value === value);
    if (!selected) {
      return;
    }
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
    setSelectedTab(selected);
  };

  if (!canViewOrder || isLoading) {
    return <Loader className="animate-spin size-5 text-brand-default" />;
  }

  if (error || !order) {
    return <p>{error?.message || "order not found"}</p>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Button
        onClick={() => router.back()}
        variant="link"
        className="w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> {t("buttons.back_to_table")}
      </Button>
      <CustomTabs
        selectedTab={selectedTab}
        handleChange={handleChange}
        tabsOptions={tabs}
      />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 h-full flex flex-1 flex-col overflow-hidden">
        {selectedTab.value !== "changes_history" && (
          <OrderCardHeader
            order={order}
            submitBtnTitle={t("buttons.save")}
            savingIsLoading={
              updateMutation.isPending || uploadImagesMutation.isPending
            }
            hasExtraAccess={permissions.hasExtraAccess}
          />
        )}
        {selectedTab.value === "order" && (
          <OrderForm
            order={order}
            uploadImagesMutation={uploadImagesMutation}
            mutation={updateMutation}
            userId={userId}
            hasExtraAccess={permissions.hasExtraAccess}
            canViewField={permissions.canViewField}
            canEditField={permissions.canEditField}
            canViewStage={permissions.canViewStage}
            canEditStage={permissions.canEditStage}
            canDeleteField={permissions.canDeleteField}
          />
        )}
        {selectedTab.value === "payments" && canViewPayments && (
          <OrderPayments orderId={order.id} orderAmount={order.amount} />
        )}
        {selectedTab.value === "chat" &&
          (order.chat === null ? (
            <div className="w-full h-full overflow-hidden rounded-b-sm bg-ui-sidebar pt-7">
              <ChatItemEmpty info={t("messages.info.no_chat")} />
            </div>
          ) : (
            <OrderChat
              chat={order.chat}
              orderId={order.id}
              orderName={order.name}
              currentUserId={userId}
              hasExtraAccess={permissions.hasExtraAccess}
            />
          ))}
        {selectedTab.value === "changes_history" && canViewHistory && (
          <OrderChangesHistory orderId={order.id} orderNumber={order.number} />
        )}
      </div>
    </div>
  );
};

export default OrderClient;
