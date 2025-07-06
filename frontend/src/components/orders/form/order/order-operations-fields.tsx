import { Order, UpdateOrderSchema } from "@/types/order.types";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

import { usePerson } from "@/api/persons/use-person";

import { Button } from "@/components/ui/button";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import FormInput from "@/components/form/form-input";
import OrderDeliveryFields from "./order-delivery-fields";
import OrderStagePerformerFields from "./order-stage-performer-fields";

interface OrderOperationsFieldsProps {
  order?: Order;
  form: UseFormReturn<UpdateOrderSchema>;
  userId: number;
}

const OrderOperationsFields = ({
  order,
  form,
  userId,
}: OrderOperationsFieldsProps) => {
  const { t } = useTranslation();

  const { data: modellers = [] } = usePerson.getModellers();
  const { data: millers = [] } = usePerson.getMillers();
  const { data: printers = [] } = usePerson.getPrinters();

  return (
    <div className="w-full flex flex-col gap-2.5 lg:gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm">{t("order.labels.order")} №</InfoLabel>
          <InfoValue className="text-sm">{order?.number}</InfoValue>
        </div>
        <InfoLabel className="text-sm hidden lg:flex">
          {t("order.labels.amount")}, ₴
        </InfoLabel>
      </div>
      <div className="flex lg:items-center flex-col lg:flex-row gap-2.5 justify-between">
        <div className="w-full flex items-center gap-2.5">
          <InfoLabel className="text-sm">
            {t("order.labels.created_by")}
          </InfoLabel>
          <InfoValue className="text-sm">{order?.createdBy}</InfoValue>
        </div>
        <div className="flex items-center justify-between">
          <InfoLabel className="text-sm flex lg:hidden">
            {t("order.labels.amount")}, ₴
          </InfoLabel>
          <FormInput
            name="amount"
            control={form.control}
            inputStyles="max-w-[100px] lg:min-w-[100px] lg:max-w-[100px]"
          />
        </div>
      </div>
      <OrderStagePerformerFields
        stageLabel={t("order.stages.modeling")}
        performerName="modeller"
        performerPlaceholder={t("placeholders.not_appointed")}
        form={form}
        performerOptions={modellers}
        stageCostName="modeling_cost"
      />
      <OrderStagePerformerFields
        stageLabel={t("order.stages.milling")}
        performerName="modeller"
        performerPlaceholder={t("placeholders.not_appointed")}
        form={form}
        performerOptions={millers}
        stageCostName="milling_cost"
      />
      <OrderStagePerformerFields
        stageLabel={t("order.stages.printing")}
        performerName="printer"
        performerPlaceholder={t("placeholders.not_appointed")}
        form={form}
        performerOptions={printers}
        stageCostName="printing_cost"
      />

      <OrderDeliveryFields order={order} form={form} userId={userId} />
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5 w-full">
        <InfoLabel className="text-sm w-[100px]">
          {t("order.labels.comment")}
        </InfoLabel>
        <FormInput
          name="notes"
          control={form.control}
          isFullWidth
          fieldType="textarea"
          rows={3}
        />
      </div>
    </div>
  );
};

export default OrderOperationsFields;
