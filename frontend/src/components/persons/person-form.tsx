import {
  AllowedRolesForCrmUser,
  CreatePersonSchema,
  Person,
  UpdatePersonSchema,
} from "@/types/person.types";
import { Country } from "@/types/location.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { SetStateAction, useState } from "react";

import { useContact } from "@/api/contacts/use-contact";

import {
  createPersonSchema,
  updatePersonSchema,
} from "@/validators/person.validator";

import { useEnumStore } from "@/stores/use-enums-store";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@components/ui/dialog";

import FormSwitch from "@/components/form/form-switch";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormArrayInput from "@/components/form/form-array-input";
import FormArrayPhone from "@/components/form/form-array-phone";
import FormArrayBankDetails from "@/components/form/form-array-bank";
import FormArrayLocation from "@/components/form/form-array-location";
import FormArrayCombobox from "@/components/form/form-array-async-combobox";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import CustomAvatar from "@/components/shared/custom-avatar";
import Modal from "@/components/shared/modal/modal";

import {
  ALLOWED_ROLES_FOR_CRM_USER,
  PERSON_ROLE_VALUES,
} from "@/constants/enums.constants";

import { getInitials } from "@/lib/utils";

const schemaMap = {
  create: createPersonSchema,
  update: updatePersonSchema,
};

interface PersonFormProps {
  mutation?: UseMutationResult<
    Person,
    Error,
    CreatePersonSchema | UpdatePersonSchema
  >;
  person?: Person;
  deletePersonMutation?: UseMutationResult<unknown, Error, number>;
  isDialogOpen?: boolean;
  setIsDialogOpen?: (v: SetStateAction<boolean>) => void;
  countries: Country[];
  onCreateCity: (v: number) => void;
  onCreateCountry: () => void;
}

const PersonForm = ({
  person,
  mutation,
  deletePersonMutation,
  isDialogOpen,
  setIsDialogOpen,
  countries = [],
  onCreateCity,
  onCreateCountry,
}: PersonFormProps) => {
  const roles = useEnumStore((e) => e.getByType("person_role"));
  const schema = person ? schemaMap.update : schemaMap.create;

  const [contactQuery, setContactQuery] = useState<string>("");
  const { data: contacts, isLoading: contactsLoading } = useContact.getContacts(
    {
      query: contactQuery,
    }
  );

  const form = useForm<UpdatePersonSchema | CreatePersonSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: person?.id,
      role: person
        ? person?.role
        : { value: PERSON_ROLE_VALUES[3], label: "Замовник" },
      first_name: person?.first_name || "",
      patronymic: person?.patronymic || "",
      last_name: person?.last_name || "",
      is_active: person?.is_active || true,
      emails: person ? person.emails : [],
      phones: person?.phones || [],
      locations: person?.locations || [],
      delivery_addresses: person?.delivery_addresses || [],
      contacts: person?.contacts || [],
      bank_details: person?.bank_details || [],
      password: "",
    },
  });

  const watchedRole = useWatch({
    control: form.control,
    name: "role",
  });

  const isCrmUser = ALLOWED_ROLES_FOR_CRM_USER.includes(
    watchedRole.value as AllowedRolesForCrmUser
  );

  const onSubmit = (formData: UpdatePersonSchema | CreatePersonSchema) => {
    mutation?.mutate({ ...formData });
  };

  //TODO: implement print
  const handlePrint = () => {
    toast.success("print btn clicked ");
  };
  return (
    <div className="h-full w-full bg-white overflow-hidden rounded-md p-4 flex flex-col">
      <Form {...form}>
        <form
          id="personForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <InfoLabel>Дата створення</InfoLabel>
              <InfoValue>
                {person
                  ? dayjs(person.created_at).format("DD.MM.YYYY")
                  : dayjs(new Date()).format("DD.MM.YYYY")}
              </InfoValue>
              {person?.id && (
                <InfoValue className="text-action-alert font-normal">
                  ID: {person?.id}
                </InfoValue>
              )}
              <FormSwitch
                name="is_active"
                control={form.control}
                checkedLabel="Активний"
                unCheckedLabel="Неактивний"
              />
            </div>
            <Button
              type="submit"
              form="personForm"
              disabled={mutation?.isPending || !form.formState.isDirty}
              className="flex items-center gap-2"
            >
              {person ? "Зберігти зміни" : "Створити"}
              {mutation?.isPending && (
                <Loader className="size-4 animate-spin text-white" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-auto pr-1 mt-6">
            <div className="flex w-full justify-between sm:flex-col sm:gap-y-4 md:flex-wrap lg:flex-row lg:flex-nowrap">
              <div className="flex gap-6 w-1/2 md:w-full">
                <CustomAvatar
                  className="w-37 h-37"
                  avatarUrl={person?.avatar_url}
                  fallback={
                    person
                      ? getInitials(person?.last_name, person?.first_name)
                      : ""
                  }
                  fallbackClassName="text-6xl"
                />
                <div className="flex flex-col gap-2.5">
                  <FormInput
                    name="last_name"
                    label="Прізвище:"
                    placeholder="Введіть прізвище"
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="first_name"
                    label="Імʼя:"
                    placeholder="Введіть імʼя"
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="patronymic"
                    label="По батькові:"
                    placeholder="Введіть по батькові"
                    control={form.control}
                  />
                  <FormSelect
                    name="role"
                    label="Роль"
                    control={form.control}
                    required
                    placeholder="Оберіть роль"
                    className="mt-2.5"
                    options={roles}
                  />
                  {!person && isCrmUser && (
                    <FormInput
                      name="password"
                      label="Пароль"
                      control={form.control}
                      placeholder="Введіть пароль"
                    />
                  )}
                  {person && (
                    <Button
                      type="button"
                      onClick={handlePrint}
                      variant="secondary"
                      className="mt-2.5 min-w-[240px] self-end"
                    >
                      Друк етикетки
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex w-1/2 md:w-full">
                <FormArrayPhone
                  name="phones"
                  control={form.control}
                  setValue={form.setValue}
                  label="Номер телефону"
                  placeholder="Введіть номер"
                  required
                  fieldKey="number"
                  messengers={person?.messengers}
                  showIsMain
                />
              </div>
            </div>

            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                Адреса
              </p>
              <FormArrayLocation
                name="locations"
                control={form.control}
                setValue={form.setValue}
                countries={countries || []}
                onCreateCity={onCreateCity}
                onCreateCountry={onCreateCountry}
              />
            </div>
            <div className="flex justify-between gap-20 w-full">
              <div className="mt-6 w-1/2 ">
                <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                  Електрона адреса
                </p>
                <FormArrayInput
                  name="emails"
                  control={form.control}
                  setValue={form.setValue}
                  placeholder="Введіть email"
                  label="Email"
                  fieldKey="email"
                  showIsMain
                />
              </div>
              <div className="mt-6 w-1/2">
                <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                  Адреса доставки
                </p>
                <FormArrayInput
                  name="delivery_addresses"
                  control={form.control}
                  setValue={form.setValue}
                  placeholder="Введіть адресу"
                  fieldKey="address_line"
                  showIsMain
                  inputClassName="min-w[460px]"
                />
              </div>
            </div>
            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                Банківські реквізити
              </p>
              <FormArrayBankDetails
                name="bank_details"
                control={form.control}
                setValue={form.setValue}
              />
            </div>
            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                Привʼязані контакти
              </p>
              <FormArrayCombobox
                name="contacts"
                control={form.control}
                options={
                  contacts?.data?.map((c) => ({
                    label: c.full_name || "",
                    value: c.id,
                    data: c,
                  })) || []
                }
                label="Контакт"
                displayKey="full_name"
                valueKey="id"
                saveFullObject
                placeholder="Оберіть контакт"
                searchQuery={contactQuery}
                setSearchQuery={setContactQuery}
                isOptionsLoading={contactsLoading}
              />
            </div>
            {person && setIsDialogOpen && (
              <div className="mt-6 border-t border-ui-border flex justify-end">
                <Button
                  variant="link"
                  type="button"
                  size="sm"
                  className="text-action-minus text-xs mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Видалити контрагента
                </Button>
                {deletePersonMutation && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Modal
                      destructive
                      header={{
                        title: "Видалення контрагента",
                        descriptionFirst: "Ви впевненні, що бажаєте видалити?",
                        descriptionSecond: "Цю дію неможливо відмінити!",
                      }}
                      footer={{
                        buttonActionTitleContinuous: "Видалення",
                        buttonActionTitle: "Видалити",
                        actionId: person.id,
                        isPending: deletePersonMutation.isPending,
                        action: () => deletePersonMutation.mutate(person.id),
                      }}
                    />
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonForm;
