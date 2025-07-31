import { Order } from "@/types/order.types";
import { CreateInvoiceSchema } from "@/types/finance.types";
import { useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFinance } from "@/api/finance/use-finance";
import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Form } from "../ui/form";
import Modal from "./modal/modal";
import InfoLabel from "./typography/info-label";
import InfoValue from "./typography/info-value";

import FormInput from "../form/form-input";
import FormSelect from "../form/form-select";

import { createInvoiceSchema } from "@/validators/finance.validator";
import { getFullName } from "@/lib/utils";
import { PAYMENT_METHOD } from "@/constants/enums.constants";

interface CreateInvoiceProps {
  order?: Order;
}

const CreateInvoice = ({ order }: CreateInvoiceProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { dialogOpen, setDialogOpen } = useDialog();

  //TODO: ADD select orders and display customer name;

  const form = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      order_id: order?.id ?? null,
      payment_method: {
        value: "card_transfer",
        label: t("finance.payment_method.card_transfer"),
      },
      amount: order?.amount ?? 0,
      description: "",
    },
  });

  const handleOnSuccess = () => {
    setDialogOpen(false);
    form.reset();
  };

  const { createInvoiceMutation } = useFinance.createInvoice({
    t,
    queryClient,
    handleOnSuccess,
  });

  const onSubmit = (formData: CreateInvoiceSchema) => {
    createInvoiceMutation?.mutate(formData);
  };

  return (
    <div className="w-full h-full">
      <Button
        variant="secondary"
        className="bg-transparent rounded-sm"
        onClick={() => setDialogOpen(true)}
      >
        {t("order.buttons.create_invoice")}
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Modal
          header={{
            title: t("finance.modal.title"),
            descriptionFirst: "",
          }}
          footer={{
            buttonActionTitle: t("buttons.create"),
            buttonActionTitleContinuous: t("buttons.create_continuous"),
            submit: true,
            formId: "createInvoiceForm",
            isPending: createInvoiceMutation.isPending,
          }}
        >
          <Form {...form}>
            <form id="createInvoiceForm" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="w-full h-full flex flex-col gap-5">
                <div className="flex items-center">
                  <InfoLabel className="w-[116px] text-sm">
                    {t("order.order")}:
                  </InfoLabel>
                  {order && (
                    <InfoValue className="text-sm font-medium">
                      №{order.number}
                    </InfoValue>
                  )}
                </div>
                <div className="flex items-center">
                  <InfoLabel className="w-[116px] text-sm">
                    {t("person.person")}:
                  </InfoLabel>
                  {order && (
                    <InfoValue className="text-sm font-medium">
                      {getFullName(
                        order.customer.first_name,
                        order.customer.last_name,
                        order.customer.patronymic
                      )}
                    </InfoValue>
                  )}
                </div>
                <FormSelect
                  name="payment_method"
                  options={PAYMENT_METHOD.map((pm) => ({
                    value: pm,
                    label: t(`finance.payment_method.${pm}`),
                  }))}
                  control={form.control}
                  label={`${t("order.labels.payment_method")}:`}
                  labelClassName="lg:justify-start min-w-[104px] w-fit"
                />
                <FormInput
                  name="amount"
                  control={form.control}
                  label={`${t("finance.labels.amount")}:`}
                  labelClassName="lg:justify-start min-w-[104px] w-fit"
                  isFullWidth
                />
                <FormInput
                  name="description"
                  control={form.control}
                  label={`${t("finance.labels.description")}:`}
                  labelClassName="lg:justify-start min-w-[104px] w-fit"
                  isFullWidth
                />
              </div>
            </form>
          </Form>
        </Modal>
      </Dialog>
    </div>
  );
};

export default CreateInvoice;
