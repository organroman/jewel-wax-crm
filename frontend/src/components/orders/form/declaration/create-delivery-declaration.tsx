import { DeliveryType } from "@/types/person.types";
import { CreateDeclarationSchema } from "@/types/novaposhta.types";
import { OrderCustomer, OrderDelivery } from "@/types/order.types";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDialog } from "@/hooks/use-dialog";

import { usePerson } from "@/api/person/use-person";
import { useOrder } from "@/api/order/use-order";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components//ui/separator";

import Modal from "@/components/shared/modal/modal";

import FormSelect from "@/components/form/form-select";
import FormDatePicker from "@/components/form/form-date-picker";
import FormInput from "@/components/form/form-input";

import DeclarationPostomatFields from "./declaration-postomat-form";
import DeclarationPayerFields from "./declaration-payer-fields";
import DeclarationParcelFields from "./declaration-parcel-fields";
import DeclarationThirdPartyFields from "./declaration-thirdParty-fields";

import { createDeclarationSchema } from "@/validators/order.validator";

interface CreateDeliveryDeclaration {
  orderName: string;
  delivery?: OrderDelivery | null;
  customer: OrderCustomer | null;
  orderId?: number | null;
  userId: number;
  isThirdParty: boolean;
}

const CreateDeliveryDeclaration = ({
  delivery,
  customer,
  orderId,
  userId,
  isThirdParty,
}: CreateDeliveryDeclaration) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isPostomat, setIsPostomat] = useState<boolean>(false);
  const [isFop, setIsFop] = useState<boolean>(false);
  const [thirdPartyDeliveryType, setThirdPartyDeliveryType] =
    useState<DeliveryType>("warehouse");

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();

  useEffect(() => {
    const postomat = delivery?.np_warehouse
      ? delivery?.np_warehouse?.includes("Поштомат")
      : false;

    setIsPostomat(postomat);
  }, [delivery]);

  const { data: person } = usePerson.getPersonById({
    id: userId,
    enabled: Boolean(userId),
  });

  const { data: cargoTypes } = useOrder.getNPCargoTypes(dialogOpen);

  const handleSuccess = () => {
    closeDialog();
  };

  const { createTTNMutation } = useOrder.createTTN({
    queryClient,
    t,
    orderId,
    handleSuccess,
  });

  const form = useForm({
    resolver: zodResolver(createDeclarationSchema),
    defaultValues: {
      payerType: {
        value: "recipient",
        label: t("order.modal.create_declaration.payer_type.recipient"),
      },
      paymentMethod: {
        value: "cash",
        label: t("order.modal.create_declaration.payment_method.cash"),
      },
      dateTime: new Date(),
      cargoType: {
        value: "Parcel",
        label: t("order.modal.create_declaration.cargo_type.parcel"),
      },
      weight: "0.5",
      seatsAmount: "1",
      description: "Полімер",
      goodCost: "300",
      volumetricWidth: "12",
      volumetricLength: "17",
      volumetricHeight: "10",
      thirdPartyRecipientName: "",
      thirdPartyRecipientSurname: "",
      thirdPartyRecipientPhone: "",
      thirdPartyStreet: "",
      thirdPartyHouse: "",
      thirdPartyFlat: "",
      tax_id: "",
    },
  });

  const onSubmit = async (formData: CreateDeclarationSchema) => {
    const isWarehouseDelivery = isThirdParty
      ? thirdPartyDeliveryType === "warehouse"
      : delivery?.type === "warehouse";

    const {
      volumetricWidth,
      volumetricLength,
      volumetricHeight,
      thirdPartyRecipientName,
      thirdPartyRecipientSurname,
      thirdPartyRecipientPhone,
      thirdPartyCity,
      thirdPartyWarehouse,
      thirdPartyStreet,
      thirdPartyHouse,
      thirdPartyFlat,
      tax_id,
      ...rest
    } = formData;

    const customerData = {
      recipient: delivery?.np_recipient_ref,
      contactRecipient: delivery?.np_contact_recipient_ref,
      recipientsPhone: isThirdParty
        ? thirdPartyRecipientPhone
        : customer?.phones[0].number,
      recipientFirstName: isThirdParty
        ? thirdPartyRecipientName
        : customer?.first_name,
      recipientLastName: isThirdParty
        ? isFop
          ? null
          : thirdPartyRecipientSurname
        : customer?.last_name,
      recipientRef: delivery?.np_recipient_ref,
      contactRecipientRef: delivery?.np_contact_recipient_ref,
      serviceType: isWarehouseDelivery
        ? "WarehouseWarehouse"
        : "WarehouseDoors",
    };
    const customerAddress: Record<string, string> = {};

    if (isWarehouseDelivery) {
      customerAddress.cityRecipient =
        (isThirdParty ? thirdPartyCity?.ref : delivery?.city_ref) ?? "";
      customerAddress.recipientAddress =
        (isThirdParty
          ? thirdPartyWarehouse?.np_warehouse_ref
          : delivery?.np_warehouse_ref) ?? "";
    } else if (delivery?.type === "door" || thirdPartyDeliveryType === "door") {
      customerAddress.newAddress = "1";
      customerAddress.recipientCityName =
        (isThirdParty ? thirdPartyCity?.name : delivery?.city_name) ?? "";
      customerAddress.recipientArea =
        (isThirdParty ? thirdPartyCity?.area : delivery?.area) ?? "";
      customerAddress.recipientAreaRegions =
        (isThirdParty ? thirdPartyCity?.region : delivery?.region) ?? "";
      customerAddress.recipientAddressName =
        (isThirdParty ? thirdPartyStreet : delivery?.street) ?? "";
      customerAddress.recipientHouse =
        (isThirdParty ? thirdPartyHouse : delivery?.house_number) ?? "";
      customerAddress.recipientName = isThirdParty
        ? isFop
          ? `${thirdPartyRecipientName ?? ""}`
          : `${thirdPartyRecipientSurname} ${thirdPartyRecipientName}`
        : `${customer?.last_name} ${customer?.first_name}`;
      customerAddress.SettlementType =
        (isThirdParty
          ? thirdPartyCity?.settlement_type
          : delivery?.settlement_type) ?? "";

      if (delivery?.flat_number || thirdPartyFlat) {
        customerAddress.recipientFlat = isThirdParty
          ? thirdPartyFlat ?? ""
          : delivery?.flat_number ?? "";
      }
    }

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
      isThirdParty,
      delivery_address_id: delivery?.delivery_address_id,
      orderId: orderId,
      sendersPhone: person?.phones.find((p) => p.is_main)?.number,
      senderAddress: person?.delivery_addresses[0].np_warehouse_ref,
      thirdPartyWarehouseName: thirdPartyWarehouse?.np_warehouse,
      thirdPartyCityName: thirdPartyCity?.name,
      tax_id,
    };

    createTTNMutation.mutate(payload);
  };

  const handleAction = form.handleSubmit(onSubmit);

  return (
    <>
      <Button
        variant="secondary"
        type="button"
        size="sm"
        className="min-w-[100px] lg:min-w-fit rounded-tl-none rounded-bl-none text-xs"
        onClick={() => setDialogOpen(true)}
        disabled={!orderId}
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
            buttonActionTitleContinuous: t("buttons.save_continuous"),
            action: handleAction,
            isPending: createTTNMutation.isPending,
          }}
        >
          <Form {...form}>
            <div className="flex flex-col gap-2.5 w-full">
              <DeclarationPayerFields form={form} />

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
              <DeclarationParcelFields form={form} />

              <FormInput
                name="description"
                control={form.control}
                label={t("order.labels.delivery_description")}
                labelPosition="top"
                isFullWidth
              />

              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 lg:h-8">
                <div className="flex items-center gap-6">
                  <div className="flex flex-row items-center gap-2.5 shrink-0">
                    <Checkbox
                      id="postomatCheckbox"
                      checked={isPostomat}
                      onCheckedChange={() => setIsPostomat(!isPostomat)}
                    />
                    <Label htmlFor="postomatCheckbox">
                      {t("order.labels.postomat_delivery")}
                    </Label>
                  </div>
                  <div className="flex flex-row items-center gap-2.5">
                    <Checkbox
                      id="thirdPartyCheckbox"
                      checked={isFop}
                      onCheckedChange={() => setIsFop(!isFop)}
                    />
                    <Label htmlFor="thirdPartyCheckbox">
                      {t("order.labels.fop")}
                    </Label>
                  </div>
                </div>
                {isFop && (
                  <FormInput
                    name="tax_id"
                    label={t("order.placeholders.tax_id")}
                    control={form.control}
                    placeholder={t("order.placeholders.tax_id")}
                    inputStyles="lg:min-w-[200px]"
                    isFullWidth
                  />
                )}
              </div>
              {isPostomat && <DeclarationPostomatFields form={form} />}
              {isThirdParty && (
                <div>
                  <Separator
                    className="mt-2.5 h-[2px] [data-orientation=horizontal]:h-[5px]"
                    orientation="horizontal"
                  />
                  <DeclarationThirdPartyFields
                    form={form}
                    thirdPartyDeliveryType={thirdPartyDeliveryType}
                    setThirdPartyDeliveryType={setThirdPartyDeliveryType}
                    isFop={isFop}
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
