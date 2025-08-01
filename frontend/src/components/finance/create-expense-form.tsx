import { CreateExpenseSchema } from "@/types/finance.types";

import { useQueryClient } from "@tanstack/react-query";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";

import { useFinance } from "@/api/finance/use-finance";
import { useOrder } from "@/api/order/use-order";
import { usePerson } from "@/api/person/use-person";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpenseSchema } from "@/validators/finance.validator";

import Modal from "../shared/modal/modal";
import InfoLabel from "../shared/typography/info-label";
import FormSelect from "../form/form-select";
import FormInput from "../form/form-input";
import FormAsyncCombobox from "../form/form-async-combobox ";
import { Form } from "../ui/form";

import { getFullName } from "@/lib/utils";
import { EXPENSE_CATEGORY, PAYMENT_METHOD } from "@/constants/enums.constants";

interface CreateExpenseFormSchema {
  setDialogOpen: (v: SetStateAction<boolean>) => void;
  dialogOpen: boolean;
}

const CreateExpenseForm = ({
  setDialogOpen,
  dialogOpen,
}: CreateExpenseFormSchema) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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

  const { data: orders, isLoading: ordersIsLoading } =
    useOrder.getPaginatedOrders({
      query: `search=${searchQuery}`,
      enabled: dialogOpen,
    });

  const { data: persons, isLoading: personsIsLoading } =
    usePerson.getPaginatedPersons({
      query: `search=${searchQuery}`,
      enabled: dialogOpen,
    });

  const handleOnSuccess = () => {
    setDialogOpen(false);
    form.reset();
  };
  const { createExpenseMutation } = useFinance.createExpense({
    queryClient,
    handleOnSuccess,
    t,
  });

  const form = useForm({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      order: undefined,
      person: undefined,
      payment_method: {
        value: "card_transfer",
        label: t("finance.payment_method.card_transfer"),
      },
      category: undefined,

      amount: "",
      description: "",
    },
  });
  const onSubmit = async (formData: CreateExpenseSchema) => {
    createExpenseMutation.mutate(formData);
  };
  return (
    <Modal
      header={{
        title: t("finance.modal.expenses_title"),
        descriptionFirst: "",
      }}
      footer={{
        buttonActionTitle: t("buttons.save"),
        buttonActionTitleContinuous: t("buttons.save_continuous"),
        submit: true,
        formId: "createExpensesForm",
        isPending: createExpenseMutation.isPending,
      }}
    >
      <Form {...form}>
        <form
          id="createExpensesForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5 justify-center items-center"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("finance.table_headers.all_finance.number")}
            </InfoLabel>
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
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("person.person")}
            </InfoLabel>
            <FormAsyncCombobox
              name="person"
              control={form.control}
              options={
                persons?.data
                  ? persons?.data.map((o) => ({
                      data: o,
                      value: o?.id,
                      label: getFullName(
                        o.first_name,
                        o.last_name,
                        o.patronymic
                      ),
                    }))
                  : []
              }
              valueKey="id"
              displayFn={(c) =>
                getFullName(c.first_name, c.last_name, c.patronymic)
              }
              searchQuery={inputValue}
              setSearchQuery={(val: string) => handleInputChange(val)}
              saveFullObject
              isOptionsLoading={personsIsLoading}
              className="lg:min-w-[280px]"
              popoverContentClassName="min-w-[280px] !border mt-1 !border-ui-border !shadow-md !rounded-md"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("finance.table_headers.order_payments.payment_method")}
            </InfoLabel>
            <FormSelect
              name="payment_method"
              control={form.control}
              options={PAYMENT_METHOD.map((pm) => ({
                value: pm,
                label: t(`finance.payment_method.${pm}`),
              }))}
              className="lg:min-w-[280px]"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("finance.expenses_type")}
            </InfoLabel>
            <FormSelect
              name="category"
              control={form.control}
              options={EXPENSE_CATEGORY.map((c) => ({
                value: c,
                label: t(`finance.expenses_category.${c}`),
              }))}
              className="lg:min-w-[280px]"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("finance.labels.amount")}
            </InfoLabel>
            <FormInput
              name="amount"
              control={form.control}
              inputStyles="lg:min-w-[280px]"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2.5">
            <InfoLabel className="text-sm w-[100px] shrink-0">
              {t("finance.labels.description")}
            </InfoLabel>
            <FormInput
              name="description"
              control={form.control}
              inputStyles="lg:min-w-[280px]"
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default CreateExpenseForm;
