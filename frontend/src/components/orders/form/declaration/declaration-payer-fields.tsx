import { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/form/form-select";
import { PAYER_TYPE, PAYMENT_METHOD } from "@/constants/novaposhta.constants";
import { useTranslation } from "react-i18next";
import { CreateDeclarationSchema } from "@/types/novaposhta.types";

interface DeclarationPayerFieldsProps {
  form: UseFormReturn<CreateDeclarationSchema>;
}

const DeclarationPayerFields = ({ form }: DeclarationPayerFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-start lg:gap-5 gap-2.5">
      <FormSelect
        name="payerType"
        label={t("order.labels.payer_type")}
        control={form.control}
        options={PAYER_TYPE.map((type) => ({
          value: type,
          label: t(`order.modal.create_declaration.payer_type.${type}`),
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
          label: t(`order.modal.create_declaration.payment_method.${method}`),
        }))}
        labelPosition="top"
        isFullWidth
      />
    </div>
  );
};

export default DeclarationPayerFields;
