"use client";

import { TabOption } from "@/types/shared.types";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { useOrder } from "@/api/order/use-order";
import { useUpload } from "@/api/upload/use-upload";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CustomTabs from "@/components/shared/custom-tabs";
import OrderCardHeader from "@/components/orders/order-card-header";
import OrderForm from "@/components/orders/form/order/order-form";
import OrderPayments from "@/components/orders/order-payments";
import OrderChat from "@/components/orders/chat/order-chat";
import ChatItemEmpty from "@/components/orders/chat/chat-item-empty";

import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";


const OrderClient = ({ id, userId }: { id: number; userId: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const { updateMutation } = useOrder.update({ queryClient, t });
  const { uploadImagesMutation } = useUpload.uploadImages();

  const tabParam = searchParams.get("tab");

  const tabs = translateKeyValueList(
    ORDER_CARD_TABS_LIST,
    t,
    "order.tabs"
  ).filter((tab) => tab.value !== "new");

  const currentTab = tabs.find((t) => t.value === tabParam);

  const [selectedTab, setSelectedTab] = useState<TabOption>(
    currentTab || tabs[0]
  );

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedTab.value === value) return;

    const selected = tabs.find((t) => t.value === value);
    if (!selected) {
      return;
    }
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
    setSelectedTab(selected);
  };

  const {
    data: order,
    isLoading,
    error,
  } = useOrder.getById({ id, enabled: id ? true : false });

  if (isLoading) {
    return <Loader />;
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
        <OrderCardHeader
          order={order}
          submitBtnTitle={t("buttons.save")}
          savingIsLoading={
            updateMutation.isPending || uploadImagesMutation.isPending
          }
        />
        {selectedTab.value === "order" && (
          <OrderForm
            order={order}
            uploadImagesMutation={uploadImagesMutation}
            mutation={updateMutation}
            userId={userId}
          />
        )}
        {selectedTab.value === "payments" && <OrderPayments />}
        {selectedTab.value === "chat" &&
          (order.chat_id === null ? (
            <div className="w-full h-full overflow-hidden rounded-b-sm bg-ui-sidebar pt-7">
              <ChatItemEmpty info={t("messages.info.no_chat")} />
            </div>
          ) : (
            <OrderChat
              chatId={order.chat_id}
              orderId={order.id}
              orderName={order.name}
              currentUserId={userId}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderClient;
