import { CreateDeclarationSchema } from "@/types/novaposhta.types";

import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormInput from "@/components/form/form-input";

interface DeclarationPostomatFieldsProps {
  form: UseFormReturn<CreateDeclarationSchema>;
}
const DeclarationPostomatFields = ({
  form,
}: DeclarationPostomatFieldsProps) => {
  const { t } = useTranslation();
  return (
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
  );
};

export default DeclarationPostomatFields;
