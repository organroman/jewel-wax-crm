import { UpdateOrderSchema } from "@/types/order.types";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormCombobox from "@/components/form/form-combobox";
import FormInput from "@/components/form/form-input";
import InfoLabel from "@/components/shared/typography/info-label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type PerformerOption = {
  id: number;
  fullname: string;
};

interface OrderStagePerformerFieldsProps<T extends FieldValues, O> {
  stageLabel: string;
  performerName: Path<T>;
  performerPlaceholder: string;
  performerOptions: PerformerOption[];
  form: UseFormReturn<UpdateOrderSchema>;
  stageCostName: Path<UpdateOrderSchema>;
  canEditField?: (field: string) => boolean;
}

const OrderStagePerformerFields = ({
  stageLabel,
  performerName,
  performerPlaceholder,
  form,
  performerOptions = [],
  stageCostName,
  canEditField = () => true,
}: OrderStagePerformerFieldsProps<UpdateOrderSchema, PerformerOption>) => {
  const { t } = useTranslation();
  const router = useRouter();

  const canEditPerformer = canEditField(performerName);
  const canEditCost = canEditField(stageCostName);

  return (
    <div className="flex items-end lg:items-center justify-between">
      <div className="flex w-full flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
        <InfoLabel className="text-sm w-[100px] shrink-0">
          {stageLabel}
        </InfoLabel>
        <div className="flex items-center">
          <FormCombobox
            name={performerName}
            placeholder={performerPlaceholder}
            control={form.control}
            valueKey="id"
            displayKey="fullname"
            options={
              (performerOptions &&
                performerOptions.map((m) => ({
                  label: m.fullname || "",
                  value: m.id,
                  data: m,
                }))) ||
              []
            }
            saveFullObject={true}
            className="min-w-full max-w-full w-full"
            isFullWidth
            disabled={!canEditPerformer}
          />
          {canEditPerformer ? (
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="hidden lg:flex rounded-tl-none rounded-bl-none text-xs w-[83px]"
              onClick={() => router.push("/persons/new")}
            >
              {t("buttons.add")}
            </Button>
          ) : (
            <div className="w-[83px]"></div>
          )}
        </div>
      </div>
      <FormInput
        name={stageCostName}
        control={form.control}
        inputStyles="min-w-[100px] max-w-[100px] lg:min-w-[100px] lg:max-w-[100px]"
        disabled={!canEditCost}
      />
    </div>
  );
};

export default OrderStagePerformerFields;
