"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/order/use-order";
import { useUpload } from "@/api/upload/use-upload";

import { Separator } from "@/components/ui/separator";
import CustomTabs from "@/components/shared/custom-tabs";
import BackButton from "@/components/shared/back-button";
import OrderCardHeader from "@/components/orders/order-card-header";
import OrderForm from "@/components/orders/form/order/order-form";

import { translateKeyValueList } from "@/lib/translate-constant-labels";
import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";

const NewOrderClient = ({ userId }: { userId: number }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const tabs = translateKeyValueList(
    ORDER_CARD_TABS_LIST,
    t,
    "order.tabs"
  ).filter((tab) => tab.value === "new");

  const { uploadImagesMutation } = useUpload.uploadImages();
  const { createMutation } = useOrder.create({
    queryClient,
    handleOnSuccess(data) {
      router.replace(`${data.id}`);
    },
    t,
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BackButton />
      <CustomTabs selectedTab={tabs[0]} tabsOptions={tabs} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <div className="mt-4 h-full flex flex-1 flex-col overflow-hidden">
        <OrderCardHeader
          submitBtnTitle={t("buttons.create")}
          savingIsLoading={
            createMutation.isPending || uploadImagesMutation.isPending
          }
        />
        <OrderForm
          uploadImagesMutation={uploadImagesMutation}
          mutation={createMutation}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default NewOrderClient;
