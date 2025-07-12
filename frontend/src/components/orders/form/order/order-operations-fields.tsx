import { Order, UpdateOrderSchema } from "@/types/order.types";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

import { usePerson } from "@/api/person/use-person";

import { Button } from "@/components/ui/button";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import FormInput from "@/components/form/form-input";
import OrderDeliveryFields from "./order-delivery-fields";
import OrderStagePerformerFields from "./order-stage-performer-fields";
import FormAsyncCombobox from "@/components/form/form-async-combobox ";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { getFullName } from "@/lib/utils";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const { data: modellers = [] } = usePerson.getModellers("role=modeller");
  const { data: millers = [] } = usePerson.getMillers("role=miller");
  const { data: printers = [] } = usePerson.getPrinters("role=print");

  const { data: customers, isLoading } = usePerson.getCustomers(
    `search=${searchQuery}`
  );

  return (
    <div className="w-full flex flex-col gap-2.5 lg:gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm">{t("order.labels.order")} №</InfoLabel>
          <InfoValue className="text-sm">
            {order ? order.number : "-"}
          </InfoValue>
        </div>
        <InfoLabel className="text-sm hidden lg:flex">
          {t("order.labels.amount")}, ₴
        </InfoLabel>
      </div>
      <div className="flex lg:items-center flex-col lg:flex-row gap-2.5 justify-between">
        {order ? (
          <div className="w-full flex items-center gap-2.5">
            <InfoLabel className="text-sm">
              {t("order.labels.created_by")}
            </InfoLabel>
            <InfoValue className="text-sm">{order?.createdBy}</InfoValue>
          </div>
        ) : (
          <div className="flex w-full flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("order.labels.customer")}
            </InfoLabel>
            <FormAsyncCombobox
              name="customer"
              control={form.control}
              options={
                customers?.data
                  ? customers?.data.map((p) => ({
                      data: p,
                      value: p?.id,
                      label: getFullName(
                        p.first_name,
                        p.last_name,
                        p.patronymic
                      ),
                    }))
                  : []
              }
              valueKey="id"
              displayFn={(c) =>
                getFullName(c.first_name, c.last_name, c.patronymic)
              }
              searchQuery={inputValue}
              setSearchQuery={(val: string) => handleInputChange(val)}
              saveFullObject
              isOptionsLoading={isLoading}
              popoverContentClassName="max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-md"
            />
          </div>
        )}
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
