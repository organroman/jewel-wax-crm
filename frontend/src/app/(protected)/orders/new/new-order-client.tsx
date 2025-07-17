"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/order/use-order";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CustomTabs from "@/components/shared/custom-tabs";

import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";
import OrderForm from "@/components/orders/form/order/order-form";
import { useUpload } from "@/api/upload/use-upload";
import OrderCardHeader from "@/components/orders/order-card-header";

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
      router.push(`${data.id}`);
    },
    t,
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Button
        onClick={() => router.back()}
        variant="link"
        className="w-fit has-[>svg]:p-0 text-text-light h-4"
      >
        <ChevronLeftIcon /> {t("buttons.back_to_table")}
      </Button>
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
