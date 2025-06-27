import { CreateDeclarationSchema } from "@/types/novaposhta.types";
import { OrderCustomer, OrderDelivery } from "@/types/order.types";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDialog } from "@/hooks/use-dialog";

import { usePerson } from "@/api/persons/use-person";
import { useOrder } from "@/api/orders/use-order";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Form } from "../ui/form";

import Modal from "../shared/modal/modal";

import FormSelect from "../form/form-select";
import FormDatePicker from "../form/form-date-picker";
import FormInput from "../form/form-input";

import { createDeclarationSchema } from "@/validators/order.validator";
import { PAYER_TYPE, PAYMENT_METHOD } from "@/constants/novaposhta.constants";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CreateDeliveryDeclaration {
  orderName: string;
  delivery?: OrderDelivery | null;
  customer: OrderCustomer | null;
  orderId?: number;
  userId: number;
}

const CreateDeliveryDeclaration = ({
  orderName,
  delivery,
  customer,
  orderId,
  userId,
}: CreateDeliveryDeclaration) => {
  const { t } = useTranslation();
  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const queryClient = useQueryClient();
  const [isPostomat, setIsPostomat] = useState<boolean>(
    delivery?.np_warehouse?.includes("Поштомат") || false
  );

  const { data: person } = usePerson.getPersonById({
    id: userId,
    enabled: Boolean(userId),
  });

  const { data: cargoTypes } = useOrder.getNPCargoTypes(dialogOpen);

  const { createTTNMutation } = useOrder.createTTN({ queryClient, t, orderId });

  const form = useForm({
    resolver: zodResolver(createDeclarationSchema),
    defaultValues: {
      payerType: {
        value: "recipient",
        label: t("order.modal.create_declaration.payer_type.recipient"),
      },
      dateTime: new Date(),
      cargoType: { value: "Parcel", label: "Посилка" },
      weight: "0.5",
      seatsAmount: "1",
      description: "Полімер",
      goodCost: "300",
      volumetricWidth: "12",
      volumetricLength: "17",
      volumetricHeight: "10",
    },
  });

  const onSubmit = async (formData: CreateDeclarationSchema) => {
    const isWarehouseDelivery = delivery?.type === "warehouse";
    const customerData = {
      recipient: delivery?.np_recipient_ref,
      contactRecipient: delivery?.np_contact_recipient_ref,
      recipientsPhone: customer?.phones[0].number,
      recipientFirstName: customer?.first_name,
      recipientLastName: customer?.last_name,
      recipientRef: delivery?.np_recipient_ref,
      contactRecipientRef: delivery?.np_contact_recipient_ref,
      serviceType: isWarehouseDelivery
        ? "WarehouseWarehouse"
        : "WarehouseDoors",
    };
    const customerAddress: Record<string, string> = {};

    if (isWarehouseDelivery) {
      (customerAddress.cityRecipient = delivery?.city_ref ?? ""),
        (customerAddress.recipientAddress = delivery.np_warehouse_ref ?? "");
    } else if (delivery?.type === "door") {
      customerAddress.newAddress = "1";
      customerAddress.recipientCityName = delivery.city_name ?? "";
      customerAddress.recipientArea = delivery.area ?? "";
      customerAddress.recipientAreaRegions = delivery.region ?? "";
      customerAddress.recipientAddressName = delivery.street ?? "";
      customerAddress.recipientHouse = delivery.house_number ?? "";
      customerAddress.recipientName = `${customer?.last_name} ${customer?.first_name}`;
      customerAddress.SettlementType = delivery.settlement_type;

      if (delivery.flat_number) {
        customerAddress.recipientFlat = delivery.flat_number;
      }
    }

    const { volumetricWidth, volumetricLength, volumetricHeight, ...rest } =
      formData;

    const optionsSeat = isPostomat
      ? [
          {
            volumetricWidth: volumetricWidth,
            volumetricLength: volumetricLength,
            volumetricHeight: volumetricHeight,
            weight: formData.weight,
          },
        ]
      : {};

    const payload = {
      ...rest,
      optionsSeat,
      ...customerData,
      ...customerAddress,
      delivery_address_id: delivery?.delivery_address_id,
      orderId: orderId,
      sendersPhone: person?.phones.find((p) => p.is_main)?.number,
      senderAddress: person?.delivery_addresses[0].np_warehouse_ref,
    };

    createTTNMutation.mutate(payload);
    createTTNMutation.isSuccess && closeDialog();
  };

  const handleAction = form.handleSubmit(onSubmit);

  return (
    <>
      <Button
        variant="secondary"
        type="button"
        size="sm"
        className="rounded-tl-none rounded-bl-none text-xs"
        onClick={() => setDialogOpen(true)}
      >
        {t("buttons.create")}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Modal
          header={{
            title: t("order.modal.create_declaration.title"),
            descriptionFirst: t("order.modal.create_declaration.desc_first"),
          }}
          footer={{
            buttonActionTitle: t("buttons.save"),
            buttonActionTitleContinuous: t("buttons.saving"),
            action: handleAction,
          }}
        >
          <Form {...form}>
            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex flex-row items-start lg:gap-5 gap-2.5">
                <FormSelect
                  name="payerType"
                  label={t("order.labels.payer_type")}
                  control={form.control}
                  options={PAYER_TYPE.map((type) => ({
                    value: type,
                    label: t(
                      `order.modal.create_declaration.payer_type.${type}`
                    ),
                  }))}
                  labelPosition="top"
                  isFullWidth
                />

                <FormSelect
                  name="paymentMethod"
                  label={t("order.labels.payment_method")}
                  control={form.control}
                  options={PAYMENT_METHOD.map((method) => ({
                    value: method,
                    label: t(
                      `order.modal.create_declaration.payment_method.${method}`
                    ),
                  }))}
                  labelPosition="top"
                  isFullWidth
                />
              </div>
              <div className="flex flex-row items-start lg:gap-5 gap-2.5">
                <FormSelect
                  name="cargoType"
                  control={form.control}
                  label={t("order.labels.cargo_type")}
                  options={cargoTypes ?? []}
                  labelPosition="top"
                  isFullWidth
                />
                <FormDatePicker
                  name="dateTime"
                  control={form.control}
                  label={t("order.labels.send_date")}
                  labelPosition="top"
                  isFullWidth
                />
              </div>
              <div className="flex flex-row items-start lg:gap-5 gap-2.5">
                <FormInput
                  name="weight"
                  control={form.control}
                  label={t("order.labels.weight")}
                  labelPosition="top"
                  inputStyles="lg:min-w-[60px]"
                />
                <FormInput
                  name="goodCost"
                  control={form.control}
                  label={t("order.labels.good_cost")}
                  labelPosition="top"
                  isFullWidth
                />
                <FormInput
                  name="seatsAmount"
                  control={form.control}
                  label={t("order.labels.seats_amount")}
                  labelPosition="top"
                  inputStyles="lg:min-w-[40px] max-w-[100px]"
                />
              </div>
              <div className="flex flex-row items-start gap-2.5">
                <FormInput
                  name="description"
                  control={form.control}
                  label={t("order.labels.delivery_description")}
                  labelPosition="top"
                  isFullWidth
                />
              </div>
              <div className="flex flex-row items-center gap-2.5">
                <Checkbox
                  id="postomatCheckbox"
                  checked={isPostomat}
                  onCheckedChange={() => setIsPostomat(!isPostomat)}
                />
                <Label htmlFor="postomatCheckbox">Відправка на поштомат</Label>
              </div>
              {isPostomat && (
                <div className="flex flex-row items-center gap-2.5">
                  <FormInput
                    name="volumetricLength"
                    control={form.control}
                    label={t("order.labels.delivery_length")}
                    labelPosition="top"
                    inputStyles="lg:min-w-[60px] max-w-[140px]"
                  />
                  <FormInput
                    name="volumetricWidth"
                    control={form.control}
                    label={t("order.labels.delivery_width")}
                    labelPosition="top"
                    inputStyles="lg:min-w-[60px] max-w-[140px]"
                  />
                  <FormInput
                    name="volumetricHeight"
                    control={form.control}
                    label={t("order.labels.delivery_height")}
                    labelPosition="top"
                    inputStyles="lg:min-w-[60px] max-w-[140px]"
                  />
                </div>
              )}
            </div>
          </Form>
        </Modal>
      </Dialog>
    </>
  );
};

export default CreateDeliveryDeclaration;
