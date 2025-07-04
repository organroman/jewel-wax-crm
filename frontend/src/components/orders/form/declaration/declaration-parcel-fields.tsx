import { CreateDeclarationSchema } from "@/types/novaposhta.types";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/form/form-input";

interface DeclarationParcelFields {
  form: UseFormReturn<CreateDeclarationSchema>;
}

const DeclarationParcelFields = ({ form }: DeclarationParcelFields) => {
  const { t } = useTranslation();
  return (
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
  );
};

export default DeclarationParcelFields;
