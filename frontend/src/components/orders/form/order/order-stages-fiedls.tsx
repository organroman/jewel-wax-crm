import { Stage, UpdateOrderSchema } from "@/types/order.types";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import InfoLabel from "@/components/shared/typography/info-label";

import FormSelect from "@/components/form/form-select";

import OrderChangeStage from "../../order-change-stage";

import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";

import { ORDER_STAGE_STATUS } from "@/constants/enums.constants";
import {
  STAGE_COLORS,
  STAGE_STATUS_COLORS,
} from "@/constants/orders.constants";

interface OrderStagesFieldsProps {
  form: UseFormReturn<UpdateOrderSchema>;
}
const OrderStagesFields = ({ form }: OrderStagesFieldsProps) => {
  const { t } = useTranslation();

  const {
    dialogOpen: changeStageDialogOpen,
    setDialogOpen: changeStageSetDialogOpen,
    openDialog: changeStageOpenDialog,
    closeDialog: changeStageCloseDialog,
  } = useDialog();

  const { fields: stages } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const handleStageChange = (newValue: Stage) => {
    form.setValue("active_stage", newValue);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex w-full items-center gap-9">
        <InfoLabel className="text-sm w-[120px]">
          {t("order.labels.stage")}
        </InfoLabel>
        <InfoLabel className="text-sm w-[140px]">
          {t("order.labels.stage_status")}
        </InfoLabel>
        <InfoLabel className="text-sm">{t("order.labels.date")}</InfoLabel>
      </div>
      <div className="border-l-4 border-ui-border pl-2 flex flex-col gap-5">
        {stages.map((field, index) => {
          return (
            <div key={field.stage} className="flex items-center gap-7 relative">
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
  );
};

export default OrderStagesFields;
