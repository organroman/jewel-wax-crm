import { Order } from "@/types/order.types";
import { CreateInvoiceSchema } from "@/types/finance.types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFinance } from "@/api/finance/use-finance";
import { useOrder } from "@/api/order/use-order";
import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Form } from "../ui/form";
import Modal from "./modal/modal";
import InfoLabel from "./typography/info-label";
import InfoValue from "./typography/info-value";

import FormInput from "../form/form-input";
import FormSelect from "../form/form-select";
import FormAsyncCombobox from "../form/form-async-combobox ";

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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const form = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      order: order
        ? {
            id: order.id,
            customer: {
              id: order.customer.id,
              first_name: order.customer.first_name,
              last_name: order.customer.last_name,
              patronymic: order.customer.patronymic,
            },
          }
        : undefined,
      payment_method: {
        value: "card_transfer",
        label: t("finance.payment_method.card_transfer"),
      },
      amount: order?.amount ?? 0,
      description: "",
    },
  });

  const { data: orders, isLoading: ordersIsLoading } =
    useOrder.getPaginatedOrders({
      query: `search=${searchQuery}`,
      enabled: dialogOpen && !order,
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

  const watchedOrder = form.watch("order") ?? order;

  const personFullname =
    watchedOrder?.customer.first_name && watchedOrder?.customer?.last_name
      ? getFullName(
          watchedOrder?.customer?.first_name,
          watchedOrder?.customer?.last_name,
          watchedOrder?.customer?.patronymic
        )
      : "-";

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
                  {order ? (
                    <InfoValue className="text-sm font-medium">
                      №{order.number}
                    </InfoValue>
                  ) : (
                    <FormAsyncCombobox
                      name="order"
                      control={form.control}
                      options={
                        orders?.data
                          ? orders?.data.map((o) => ({
                              data: o,
                              value: o?.id,
                              label: String(o.number),
                            }))
                          : []
                      }
                      valueKey="id"
                      displayKey="number"
                      searchQuery={inputValue}
                      setSearchQuery={(val: string) => handleInputChange(val)}
                      saveFullObject
                      isOptionsLoading={ordersIsLoading}
                      className="lg:min-w-[280px]"
                      popoverContentClassName="min-w-[280px] !border mt-1 !border-ui-border !shadow-md !rounded-md"
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <InfoLabel className="w-[116px] text-sm">
                    {t("person.person")}:
                  </InfoLabel>
                  <InfoValue className="text-sm font-medium">
                    {personFullname}
                  </InfoValue>
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
