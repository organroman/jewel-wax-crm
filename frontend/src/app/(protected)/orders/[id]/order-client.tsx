"use client";

import { TabOption } from "@/types/shared.types";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { useOrder } from "@/api/orders/use-order";
import { useUpload } from "@/api/upload/use-upload";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import CustomTabs from "@/components/shared/custom-tabs";
import OrderCardHeader from "@/components/orders/order-card-header";
import OrderForm from "@/components/orders/form/order/order-form";
import OrderPayments from "@/components/orders/order-payments";
import OrderChat from "@/components/orders/order-chat";

import { translateKeyValueList } from "@/lib/translate-constant-labels";
import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";
import { useDialog } from "@/hooks/use-dialog";
import { getFullName } from "@/lib/utils";

const OrderClient = ({ id, userId }: { id: number; userId: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen,
    closeDialog,
  } = useDialog();

  const { updateMutation } = useOrder.update({ queryClient, t });
  const { uploadImagesMutation } = useUpload.uploadImages();

  const handleDeleteSuccess = () => {
    closeDialog();
    router.replace("/orders");
  };
  const { deleteOrderMutation } = useOrder.delete({
    queryClient,
    t,
    handleSuccess: handleDeleteSuccess,
  });

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
    if (selectedTab.value === value) return;

    const selected = tabs.find((t) => t.value === value);
    if (!selected) {
      return;
    }

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
        onClick={() => router.push("/orders")}
        variant="link"
        className=" w-fit has-[>svg]:p-0 text-text-light h-4"
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
          orderId={order.id}
          isFavorite={order.is_favorite}
          isImportant={order.is_important}
          customerId={order.customer.id}
          customerFullName={getFullName(
            order.customer.first_name,
            order.customer.last_name,
            order.customer.patronymic
          )}
          orderNumber={order.number}
          savingIsLoading={
            updateMutation.isPending || uploadImagesMutation.isPending
          }
        />
        {selectedTab.value === "order" && (
          <OrderForm
            order={order}
            deleteMutation={deleteOrderMutation}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setDialogOpen}
            uploadImagesMutation={uploadImagesMutation}
            mutation={updateMutation}
            userId={userId}
          />
        )}
        {selectedTab.value === "payments" && <OrderPayments />}
        {selectedTab.value === "chat" && <OrderChat />}
      </div>
    </div>
  );
};

export default OrderClient;
