import {
  Order,
  OrderMedia,
  Stage,
  UpdateOrderSchema,
} from "@/types/order.types";
import { ResultUploadedFile } from "@/types/upload.types";
import { Action } from "@/types/permission.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Form } from "@components/ui/form";
import { Separator } from "@components/ui/separator";

import FormArrayLinkedOrders from "@components/form/form-array-linked-orders";
import FormInput from "@components/form/form-input";

import OrderMediaComponent from "@/components/orders/media/order-media";
import OrderStagesFields from "./order-stages-fields";
import DeleteOrder from "./delete-order";
import OrderOperationsFields from "./order-operations-fields";

import { updateOrderSchema } from "@/validators/order.validator";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "@/constants/enums.constants";

interface OrderFormProps {
  order?: Order;
  uploadImagesMutation: UseMutationResult<ResultUploadedFile[], Error, File[]>;
  mutation: UseMutationResult<Order, Error, UpdateOrderSchema>;
  userId: number;
  hasExtraAccess?: (action: Action, entity: string) => boolean;
  canViewField?: (field: string) => boolean;
  canEditField?: (field: string) => boolean;
  canDeleteField?: (field: string) => boolean;
  canViewStage?: (stage: Stage) => boolean;
  canEditStage?: (stage: Stage) => boolean;
}

const OrderForm = ({
  order,
  mutation,
  uploadImagesMutation,
  userId,
  hasExtraAccess = () => true,
  canViewStage = () => true,
  canEditStage = () => true,
  canViewField = () => true,
  canEditField = () => true,
  canDeleteField = () => true,
}: OrderFormProps) => {
  const { t } = useTranslation();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<OrderMedia[]>(order?.media ?? []);

  const canViewCustomer = hasExtraAccess("VIEW", "customer");
  const canDeleteOrder = hasExtraAccess("DELETE", "order");

  const defaultOrderStages = ORDER_STAGE.filter((stageKey) =>
    canViewStage(stageKey)
  ).map((stageKey) => {
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
        : null,
      started_at: existing?.started_at ?? undefined,
      completed_at: existing?.completed_at ?? undefined,
    };
  });

  const form = useForm<z.infer<typeof updateOrderSchema>>({
    resolver: zodResolver(updateOrderSchema) as any,
    defaultValues: {
      id: order?.id || null,
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
        is_third_party: order.delivery.is_third_party
          ? order.delivery.is_third_party
          : false,
      }) || { declaration_number: "", cost: 0.0, is_third_party: false },
      notes: order?.notes || "",
      customer: order?.customer || null,
      stages: defaultOrderStages,
      active_stage: order?.active_stage || "new",
      linked_orders: order?.linked_orders || [],
      media: order?.media || [],
      created_at: order?.created_at ?? null,
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
          cost: order.delivery?.cost || 0.0,
          is_third_party: order.delivery?.is_third_party || false,
        },
        notes: order.notes || "",
        customer: order.customer || null,
        stages: defaultOrderStages,
        active_stage: order.active_stage || "new",
        linked_orders: order.linked_orders || [],
        media: order.media || [],
        created_at: order?.created_at ?? null,
      });
    }
  }, [order]);

  const onSubmit = async (formData: UpdateOrderSchema) => {
    if (newFiles.length) {
      uploadImagesMutation.mutate(newFiles, {
        onSuccess: (data) => {
          const currentMedia = form.getValues("media");
          const newMedia = data.map((media) => ({
            url: media.url,
            type: media.format === "image" ? "image" : "other",
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
    } else
      mutation.mutate({
        ...formData,
      });
  };

  const handleUpdateImages = (media: OrderMedia[]) => {
    form.setValue("media", media);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-ui-sidebar p-4 flex flex-col rounded-bl-md rounded-br-md ">
      <Form {...form}>
        <form
          id="orderForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full flex-1"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-7">
              <div className="w-full lg:w-1/3 overflow-x-hidden flex flex-col gap-5">
                <OrderMediaComponent
                  newFiles={newFiles}
                  setNewFiles={setNewFiles}
                  previews={previews}
                  setPreviews={setPreviews}
                  currentMedia={form.getValues("media")}
                  handleUpdateMedia={handleUpdateImages}
                  hasExtraAccess={hasExtraAccess}
                />
              </div>
              <div className="w-full lg:w-3/4">
                <div className="flex items-end w-full gap-5 lg:mb-3.5 relative">
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
                  <div className="flex items-center gap-2.5 mb-0.5 absolute lg:static right-0 -top-2">
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
                <div className="flex flex-col lg:flex-row items-start gap-5 mt-7">
                  <OrderOperationsFields
                    order={order}
                    form={form}
                    userId={userId}
                    canViewField={canViewField}
                    canEditField={canEditField}
                    canViewCustomer={canViewCustomer}
                  />

                  <OrderStagesFields
                    form={form}
                    canEditStage={canEditStage}
                    canEditField={canEditField}
                  />
                </div>
              </div>
            </div>
            {canViewField("linked_orders") && (
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
                  canEditField={canEditField("linked_orders")}
                  canDeleteField={canDeleteField("linked_orders")}
                />
              </div>
            )}
            {order && canDeleteOrder && <DeleteOrder orderId={order.id} />}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
