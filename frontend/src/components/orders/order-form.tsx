import {
  Order,
  OrderMedia,
  Stage,
  UpdateOrderSchema,
} from "@/types/order.types";
import { ResultUploadedFile } from "@/types/upload.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { UseMutationResult } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";

import { usePerson } from "@/api/persons/use-person";
import { useDialog } from "@/hooks/use-dialog";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";

import FormArrayLinkedOrders from "../form/form-array-linked-orders";
import FormInput from "../form/form-input";
import FormCombobox from "../form/form-combobox";
import FormSelect from "../form/form-select";

import Modal from "../shared/modal/modal";
import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";
import OrderChangeStage from "./order-change-stage";

import OrderImages from "./order-images";

import { updateOrderSchema } from "@/validators/order.validator";

import {
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";
import { ORDER_STAGE, ORDER_STAGE_STATUS } from "@/constants/enums.constants";
import { cn } from "@/lib/utils";
import CreateDeliveryDeclaration from "./create-delivery-declaration";

interface OrderFormProps {
  order?: Order;
  deleteMutation?: UseMutationResult<unknown, Error, number>;
  isDeleteDialogOpen?: boolean;
  setIsDeleteDialogOpen?: (v: SetStateAction<boolean>) => void;
  uploadImagesMutation: UseMutationResult<ResultUploadedFile[], Error, File[]>;
  mutation: UseMutationResult<Order, Error, UpdateOrderSchema>;
  userId: number;
}

const OrderForm = ({
  order,
  mutation,
  deleteMutation,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  uploadImagesMutation,
  userId,
}: OrderFormProps) => {
  const { t } = useTranslation();

  const { data: modellers = [] } = usePerson.getModellers();
  const { data: millers = [] } = usePerson.getMillers();
  const { data: printers = [] } = usePerson.getPrinters();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<OrderMedia[]>(order?.media ?? []);

  const {
    dialogOpen: changeStageDialogOpen,
    setDialogOpen: changeStageSetDialogOpen,
    openDialog: changeStageOpenDialog,
    closeDialog: changeStageCloseDialog,
  } = useDialog();

  const defaultOrderStages = ORDER_STAGE.map((stageKey) => {
    const existing = order?.stages.find((s) => s.stage === stageKey);
    const statusKey = existing?.status ?? undefined;
    const statusOption = ORDER_STAGE_STATUS.find((s) => s === statusKey);
    const pendingOption = ORDER_STAGE_STATUS.find((s) => s === "pending");
    return {
      id: existing?.id ?? undefined,
      order_id: existing?.order_id ?? undefined,
      stage: stageKey,
      status: statusOption
        ? {
            value: statusOption,
            label: t(`order.stage_statuses.${statusOption}`),
          }
        : stageKey === "new"
        ? {
            value: pendingOption,
            label: t(`order.stage_statuses.${pendingOption}`),
          }
        : undefined,
      started_at: existing?.started_at ?? undefined,
      completed_at: existing?.completed_at ?? undefined,
    };
  });

  const form = useForm({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      id: order?.id,
      number: order?.number || "",
      name: order?.name || "",
      description: order?.description || "",
      amount: order?.amount || 0.0,
      modeller: order?.modeller || null,
      modeling_cost: order?.modeling_cost || 0.0,
      miller: order?.miller || null,
      milling_cost: order?.milling_cost || 0.0,
      printer: order?.printer || null,
      printing_cost: order?.printing_cost || 0.0,
      delivery: (order?.delivery && {
        ...order.delivery,
        declaration_number: order.delivery.declaration_number
          ? order.delivery.declaration_number
          : "",
      }) || { declaration_number: "", cost: "0.00" },
      notes: order?.notes || "",
      customer: order?.customer || null,
      stages: defaultOrderStages,
      active_stage: order?.active_stage || "new",
      linked_orders: order?.linked_orders || [],
      media: order?.media || [],
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        id: order.id,
        number: order.number || "",
        name: order.name || "",
        description: order.description || "",
        amount: order.amount || 0.0,
        modeller: order.modeller || null,
        modeling_cost: order.modeling_cost || 0.0,
        miller: order.miller || null,
        milling_cost: order.milling_cost || 0.0,
        printer: order.printer || null,
        printing_cost: order.printing_cost || 0.0,
        delivery: {
          ...order.delivery,
          declaration_number: order.delivery?.declaration_number || "",
          cost: order.delivery?.cost || "0.00",
        },
        notes: order.notes || "",
        customer: order.customer || null,
        stages: defaultOrderStages,
        active_stage: order.active_stage || "new",
        linked_orders: order.linked_orders || [],
        media: order.media || [],
      });
    }
  }, [order]);

  const { fields: stages } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const handleStageChange = (newValue: Stage) => {
    form.setValue("active_stage", newValue);
  };

  const onSubmit = async (formData: UpdateOrderSchema) => {
    if (newFiles.length) {
      uploadImagesMutation.mutate(newFiles, {
        onSuccess: (data) => {
          const currentMedia = form.getValues("media");
          const newMedia = data.map((media) => ({
            url: media.url,
            type: "image",
            public_id: media.public_id,
            uploaded_by: +media.uploaded_by,
            is_main: false,
            order_id: order?.id,
            name: media.name,
          }));

          form.setValue("media", [...currentMedia, ...newMedia]);

          mutation.mutate(
            {
              ...formData,
              media: form.getValues("media"),
            },
            {
              onSuccess: (data) => form.setValue("media", data.media),
            }
          );
        },
      });
      setNewFiles([]);
    } else mutation.mutate(formData);
  };

  const handleUpdateImages = (media: OrderMedia[]) => {
    form.setValue("media", media);
  };

  const deliveryOptions = order?.customer.delivery_addresses
    ? order?.customer.delivery_addresses?.map((a) => ({
        label: a.address_line,
        value: a.delivery_address_id,
        data: {
          ...a,
          declaration_number: "",
          cost: "0.00",
        },
      }))
    : [];

  return (
    <div className="h-full w-full overflow-y-auto bg-ui-sidebar p-4 flex flex-col rounded-bl-md rounded-br-md ">
      <Form {...form}>
        <form
          id="orderForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full flex-1"
        >
          <div className="flex flex-col gap-5">
            <div className="flex gap-7">
              <div className="w-1/3 overflow-x-hidden">
                <OrderImages
                  newFiles={newFiles}
                  setNewFiles={setNewFiles}
                  previews={previews}
                  setPreviews={setPreviews}
                  currentMedia={form.getValues("media")}
                  handleUpdateMedia={handleUpdateImages}
                />
              </div>
              <div className="w-3/4">
                <div className="flex items-end w-full gap-5 mb-3.5">
                  <FormInput
                    name="name"
                    label={t("order.labels.name")}
                    placeholder={t("order.placeholders.name")}
                    control={form.control}
                    required
                    labelPosition="top"
                    inputStyles="w-full"
                    isFullWidth
                  />
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <p className="text-text-muted text-sm whitespace-nowrap">
                      {t("order.labels.days")}
                    </p>
                    <div className="size-9 rounded-xs border-ui-border border text-sm text-brand-default flex items-center justify-center">
                      {order?.processing_days ?? "-"}
                    </div>
                  </div>
                </div>
                <FormInput
                  name="description"
                  label={t("order.labels.desc")}
                  placeholder={t("order.placeholders.desc")}
                  control={form.control}
                  labelPosition="top"
                  inputStyles="w-full"
                  fieldType="textarea"
                  rows={3}
                />
                <div className="flex items-start gap-5 mt-7">
                  <div className="w-full flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <InfoLabel className="text-sm">
                          {t("order.labels.order")} №
                        </InfoLabel>
                        <InfoValue className="text-sm">
                          {order?.number}
                        </InfoValue>
                      </div>
                      <InfoLabel className="text-sm">
                        {t("order.labels.amount")}, ₴
                      </InfoLabel>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-full flex items-center gap-2.5">
                        <InfoLabel className="text-sm">
                          {t("order.labels.created_by")}
                        </InfoLabel>
                        <InfoValue className="text-sm">
                          {order?.createdBy}
                        </InfoValue>
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
                          delivery={form.getValues("delivery")}
                          orderId={form.getValues("id")}
                          userId={userId}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 w-full">
                      <InfoLabel className="text-sm w-[100px]">
                        {t("order.labels.comment")}
                      </InfoLabel>
                      <FormInput
                        name="notes"
                        control={form.control}
                        isFullWidth
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-5">
                    <div className="flex w-full items-center gap-9">
                      <InfoLabel className="text-sm w-[120px]">
                        {t("order.labels.stage")}
                      </InfoLabel>
                      <InfoLabel className="text-sm w-[140px]">
                        {t("order.labels.stage_status")}
                      </InfoLabel>
                      <InfoLabel className="text-sm">
                        {t("order.labels.date")}
                      </InfoLabel>
                    </div>
                    <div className="border-l-4 border-ui-border pl-2 flex flex-col gap-5">
                      {stages.map((field, index) => {
                        return (
                          <div
                            key={field.stage}
                            className="flex items-center gap-7 relative"
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center w-[120px] h-[32px] text-xs rounded-xs",
                                STAGE_COLORS[field.stage]
                              )}
                            >
                              {t(`order.stages.${field.stage}`)}
                            </div>
                            {form.getValues("active_stage") === field.stage && (
                              <div className="absolute top-0 -left-3 h-full w-1 bg-brand-default"></div>
                            )}
                            <FormSelect
                              name={`stages.${index}.status`}
                              placeholder={t("placeholders.choose")}
                              control={form.control}
                              options={ORDER_STAGE_STATUS.map((s) => ({
                                value: s,
                                label: t(`order.stage_statuses.${s}`),
                              }))}
                              className={cn(
                                "lg:min-w-[140px] lg:max-w-[140px]",
                                field.status?.value &&
                                  STAGE_STATUS_COLORS[field.status?.value]
                              )}
                            />

                            <p className="text-xs font-medium">
                              {field.completed_at
                                ? dayjs(field.completed_at).format("DD.MM.YYYY")
                                : "-"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="self-start text-xs px-5"
                      onClick={() => changeStageOpenDialog()}
                    >
                      {t("order.buttons.change_stage")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex flex-col w-full">
              <p className="font-medium text-text-regular mb-2.5">
                {t("order.linked_orders.linked")}
              </p>
              <Separator className="bg-ui-border h-[1px] data-[orientation=horizontal]:h-[1px0]" />
              <FormArrayLinkedOrders
                control={form.control}
                name="linked_orders"
                setValue={form.setValue}
                orderId={order?.id ?? null}
              />
            </div>
            {order && setIsDeleteDialogOpen && (
              <div className="border-t border-ui-border flex justify-end">
                <Button
                  variant="link"
                  type="button"
                  size="sm"
                  className="text-action-minus text-xs mt-4"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  {t("order.buttons.delete")}
                </Button>
                {deleteMutation && (
                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <Modal
                      destructive
                      header={{
                        title: t("order.modal.delete.title"),
                        descriptionFirst: t("messages.info.confirm_delete"),
                        descriptionSecond: t("messages.info.action_undone"),
                      }}
                      footer={{
                        buttonActionTitleContinuous: t(
                          "buttons.delete_continuous"
                        ),
                        buttonActionTitle: t("buttons.delete"),
                        actionId: order.id,
                        isPending: deleteMutation.isPending,
                        action: () => deleteMutation.mutate(order.id),
                      }}
                    />
                  </Dialog>
                )}
              </div>
            )}
            <Dialog
              open={changeStageDialogOpen}
              onOpenChange={changeStageSetDialogOpen}
            >
              <OrderChangeStage
                currentStage={form.getValues("active_stage")}
                handleStageChange={handleStageChange}
                closeDialog={changeStageCloseDialog}
              />
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
