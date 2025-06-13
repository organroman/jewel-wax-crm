import { FormArrayLinkedOrdersProps } from "@/types/form.types";

import {
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import FormArrayInputItem from "./form-array-input-item";
import InfoLabel from "../shared/typography/info-label";
import Link from "next/link";
import FormInput from "./form-input";
import { Dialog } from "../ui/dialog";
import Modal from "../shared/modal/modal";
import AsyncComboBox from "../shared/filter/filter-async-combobox";
import { useDialog } from "@/hooks/use-dialog";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useOrder } from "@/api/orders/use-order";
import { LinkedOrder } from "@/types/order.types";
import AsyncCombobox from "../shared/async-combobox";

type Option<T> = {
  label: string;
  value: string | number;
  data?: T;
};

const FormArrayLinkedOrders = <T extends FieldValues>({
  name,
  control,
  setValue,
  orderId,
  required = false,
}: FormArrayLinkedOrdersProps<T>) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const watchedFields = useWatch({ name: name as Path<T>, control });
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Option<{
    id: number;
    number: number;
  }> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [, setDebouncedValue] = useState("");

  const { dialogOpen, setDialogOpen } = useDialog();

  const { data: orders, isLoading } = useOrder.getOrdersNumbers({
    query: `q=${searchQuery}`,
    enabled: dialogOpen,
  });

  const debouncedSearchQuery = useMemo(
    () => debounce((value: string) => setDebouncedValue(value), 500),
    []
  );

  useEffect(() => {
    debouncedSearchQuery(searchQuery);
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [searchQuery, debouncedSearchQuery]);

  const onSelect = (data: Option<{ id: number; number: number }>) => {
    setSelected(data);
  };

  const handleAppend = () => {
    if (!selected?.data) return;
    setDialogOpen(false);
    setTimeout(() => {
      append({
        comment: "",
        is_common_delivery: false,
        order_id: orderId,
        linked_order_id: selected?.data?.id,
        linked_order_number: selected?.data?.number,
      } as any);
    }, 100);
    setSearchQuery("");
    setSelected(null);
  };

  const handleToggleCommonDelivery = (index: number) => {
    const isCommonDelivery: boolean =
      watchedFields?.[index]?.is_common_delivery;
    setValue(
      `${name}.${index}.is_common_delivery` as Path<T>,
      !isCommonDelivery as PathValue<T, any>
    );
  };

  return (
    <div className="flex w-full flex-wrap gap-5 mt-5">
      {fields.map((field, index) => {
        const fieldItem = fields[index] as unknown as LinkedOrder;
        const base = `${name}.${index}` as Path<T>;
        const watchedField = watchedFields?.[index] ?? {};
        const isCommonDelivery = watchedField.is_common_delivery ?? false;
        const linkedOrderNumber = fieldItem.linked_order_number;
        const linkedOrderId = fieldItem.linked_order_id;

        return (
          <div
            key={field.id}
            className="flex w-full lg:w-full flex-col items-start justify-start gap-3"
          >
            <div className="flex w-full flex-col items-start gap-2.5">
              <div className="flex w-full items-end lg:items-start gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <InfoLabel className="text-sm whitespace-nowrap">
                      {t("order.order")} №
                    </InfoLabel>
                    <Link
                      className="text-sm underline underline-offset-3 text-action-plus"
                      href={`/orders/${linkedOrderId}`}
                    >
                      {linkedOrderNumber}
                    </Link>
                  </div>
                  <div className="flex mb-1.5 lg:mb-0 items-center gap-2">
                    <Switch
                      checked={isCommonDelivery}
                      onCheckedChange={() => handleToggleCommonDelivery(index)}
                    />
                    <Label className="hidden lg:block text-xs whitespace-nowrap">
                      {t("order.labels.common_delivery")}
                    </Label>
                    <Label className="block lg:hidden text-xs">
                      {t("order.labels.common_delivery")}
                    </Label>
                  </div>

                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghostDestructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <InfoLabel>Коментар </InfoLabel>
                  <FormInput
                    name={`${base}.comment` as Path<T>}
                    control={control}
                    fieldType="textarea"
                    rows={3}
                    isFullWidth
                  />
                </div>
              </div>
            </div>

            {fields.length === index + 1 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="text-action-plus text-xs px-0"
              >
                {t("buttons.add_more")}
              </Button>
            )}
          </div>
        );
      })}

      {fields.length === 0 && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="text-action-plus text-xs px-0"
        >
          {t("buttons.add")}
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Modal
          header={{
            title: t("order.modal.linked_order.title"),
            descriptionFirst: t("order.modal.linked_order.desc_first"),
          }}
          footer={{
            buttonActionTitleContinuous: t("buttons.adding"),
            buttonActionTitle: t("buttons.add"),
            action: () => handleAppend(),
          }}
        >
          <div className="flex items-center justify-center">
            <AsyncCombobox
              search={searchQuery}
              setSearch={setSearchQuery}
              label={t("order.order")}
              options={
                orders?.data
                  ? orders.data.map((o) => ({
                      label: o.number.toString(),
                      value: o.id,
                      data: o,
                    }))
                  : []
              }
              displayKey="number"
              value={selected}
              valueKey="id"
              onChange={(data) => onSelect(data)}
              isLoading={isLoading}
            />
          </div>
        </Modal>
      </Dialog>
    </div>
  );
};

export default FormArrayLinkedOrders;
