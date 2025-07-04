import { Order, UpdateOrderSchema } from "@/types/order.types";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormCombobox from "@/components/form/form-combobox";
import FormCheckbox from "@/components/form/form-checkbox";
import FormInput from "@/components/form/form-input";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

import CreateDeliveryDeclaration from "../declaration/create-delivery-declaration";

interface OrderDeliveryFields {
  order?: Order;
  form: UseFormReturn<UpdateOrderSchema>;
  userId: number;
}

const OrderDeliveryFields = ({ order, form, userId }: OrderDeliveryFields) => {
  const { t } = useTranslation();

  const deliveryOptions = order?.customer.delivery_addresses
    ? order?.customer.delivery_addresses?.map((a) => ({
        label: a.address_line,
        value: a.delivery_address_id,
        data: {
          ...a,
          declaration_number: "",
          cost: "0.00",
          is_third_party: false,
        },
      }))
    : [];
  return (
    <>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <InfoLabel className="text-sm w-[100px]">
            {t("order.stages.delivery")}
          </InfoLabel>
          <div className="flex items-center">
            <FormCombobox
              name="delivery"
              placeholder={t("placeholders.not_chosen")}
              control={form.control}
              valueKey="delivery_address_id"
              displayKey="address_line"
              saveFullObject
              options={deliveryOptions}
            />
            <div className="flex flex-row items-center gap-1 ml-2.5 w-[73px]">
              <FormCheckbox
                name="delivery.is_third_party"
                label="Інша"
                control={form.control}
              />
            </div>
          </div>
        </div>
        <FormInput
          name="delivery.cost"
          control={form.control}
          inputStyles="lg:min-w-[100px] lg:max-w-[100px]"
          // defaultValue="0.00"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <InfoLabel className="text-sm w-[100px]">
          {t("order.labels.declaration_number")}
        </InfoLabel>
        <div className="flex items-center">
          <FormInput
            name="delivery.declaration_number"
            control={form.control}
          />
          <CreateDeliveryDeclaration
            orderName={form.getValues("name")}
            customer={form.getValues("customer")}
            delivery={form.watch("delivery")}
            orderId={form.getValues("id")}
            userId={userId}
            isThirdParty={form.watch("delivery.is_third_party")}
          />
        </div>
      </div>
      {order?.delivery?.is_third_party &&
        order?.delivery?.declaration_number !== "" && (
          <div className="flex items-center gap-2.5 w-full">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("order.modal.create_declaration.payer_type.recipient")}
            </InfoLabel>
            <div className="flex flex-col gap-1.5">
              <InfoValue>
                {order?.delivery?.manual_recipient_name}, тел.{" "}
                {order?.delivery?.manual_recipient_phone}
              </InfoValue>
              <InfoValue>{order?.delivery?.manual_delivery_address}</InfoValue>
            </div>
          </div>
        )}
    </>
  );
};

export default OrderDeliveryFields;
