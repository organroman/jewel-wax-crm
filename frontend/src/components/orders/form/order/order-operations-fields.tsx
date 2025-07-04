import { Order, UpdateOrderSchema } from "@/types/order.types";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

import { usePerson } from "@/api/persons/use-person";

import { Button } from "@/components/ui/button";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import FormInput from "@/components/form/form-input";
import FormCombobox from "@/components/form/form-combobox";
import OrderDeliveryFields from "./order-delivery-fields";

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
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm">{t("order.labels.order")} №</InfoLabel>
          <InfoValue className="text-sm">{order?.number}</InfoValue>
        </div>
        <InfoLabel className="text-sm">{t("order.labels.amount")}, ₴</InfoLabel>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center gap-2.5">
          <InfoLabel className="text-sm">
            {t("order.labels.created_by")}
          </InfoLabel>
          <InfoValue className="text-sm">{order?.createdBy}</InfoValue>
        </div>
        <FormInput
          name="amount"
          control={form.control}
          inputStyles="lg:min-w-[100px] lg:max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm w-[100px]">
            {t("order.stages.modeling")}
          </InfoLabel>
          <div className="flex items-center">
            <FormCombobox
              name="modeller"
              placeholder={t("placeholders.not_appointed")}
              control={form.control}
              valueKey="id"
              displayKey="fullname"
              options={
                (modellers &&
                  modellers.map((m) => ({
                    label: m.fullname || "",
                    value: m.id,
                    data: m,
                  }))) ||
                []
              }
              saveFullObject={true}
            />
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="rounded-tl-none rounded-bl-none text-xs w-[83px]"
              // onClick={onCreateCountry}
            >
              {t("buttons.add")}
            </Button>
          </div>
        </div>
        <FormInput
          name="modeling_cost"
          control={form.control}
          inputStyles="lg:min-w-[100px] lg:max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm w-[100px]">
            {t("order.stages.milling")}
          </InfoLabel>
          <div className="flex items-center">
            <FormCombobox
              name="miller"
              placeholder={t("placeholders.not_appointed")}
              control={form.control}
              valueKey="id"
              displayKey="fullname"
              saveFullObject
              options={
                (millers &&
                  millers.map((m) => ({
                    label: m.fullname || "",
                    value: m.id,
                    data: m,
                  }))) ||
                []
              }
            />
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="rounded-tl-none rounded-bl-none text-xs w-[83px]"
              // onClick={onCreateCountry}
            >
              {t("buttons.add")}
            </Button>
          </div>
        </div>
        <FormInput
          name="milling_cost"
          control={form.control}
          inputStyles="lg:min-w-[100px] lg:max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm w-[100px]">
            {t("order.stages.printing")}
          </InfoLabel>
          <div className="flex items-center">
            <FormCombobox
              name="printer"
              placeholder={t("placeholders.not_appointed")}
              control={form.control}
              valueKey="id"
              displayKey="fullname"
              saveFullObject
              options={
                (printers &&
                  printers.map((m) => ({
                    label: m.fullname || "",
                    value: m.id,
                    data: m,
                  }))) ||
                []
              }
            />
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="rounded-tl-none rounded-bl-none text-xs w-[83px]"
              // onClick={onCreateCountry}
            >
              {t("buttons.add")}
            </Button>
          </div>
        </div>
        <FormInput
          name="printing_cost"
          control={form.control}
          inputStyles="lg:min-w-[100px] lg:max-w-[100px]"
        />
      </div>
      <OrderDeliveryFields order={order} form={form} userId={userId} />
      <div className="flex items-center gap-2.5 w-full">
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
