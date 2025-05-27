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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const rolesEnum = useEnumStore((e) => e.getByType("person_role"));
  const roles = rolesEnum.map((role) => ({
    ...role,
    label: t(`person.roles.${role.value}`),
  }));
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
        : {
            value: PERSON_ROLE_VALUES[3],
            label: t(`person.roles.${PERSON_ROLE_VALUES[3]}`),
          },
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

  console.log(form.formState.errors);

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
          className="flex flex-col h-full flex-1 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-y-2 lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5">
              <InfoLabel>{t("person.labels.created_at")}</InfoLabel>
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
              <div className="hidden lg:flex">
                <FormSwitch
                  name="is_active"
                  control={form.control}
                  checkedLabel={t("person.labels.active")}
                  unCheckedLabel={t("person.labels.inactive")}
                />
              </div>
            </div>
            <div className="flex items-center w-full lg:w-fit justify-between">
              <div className="flex lg:hidden">
                <FormSwitch
                  name="is_active"
                  control={form.control}
                  checkedLabel={t("person.labels.active")}
                  unCheckedLabel={t("person.labels.inactive")}
                />
              </div>
              <Button
                type="submit"
                form="personForm"
                disabled={mutation?.isPending || !form.formState.isDirty}
                className="flex items-center gap-2"
              >
                {person ? t("buttons.save_changes") : t("buttons.create")}
                {mutation?.isPending && (
                  <Loader className="size-4 animate-spin text-white" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto pr-1 mt-6">
            <div className="flex w-full justify-between flex-col sm:gap-y-4 md:flex-wrap lg:flex-row lg:flex-nowrap">
              <div className="flex flex-col items-center lg:flex-row gap-6 md:w-1/2 w-full">
                <div className="w-full lg:w-fit flex justify-center lg:justify-start">
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
                </div>
                <div className="flex flex-col gap-2.5">
                  <FormInput
                    name="last_name"
                    label={`${t("person.labels.last_name")}:`}
                    placeholder={t("person.placeholders.last_name")}
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="first_name"
                    label={`${t("person.labels.first_name")}:`}
                    placeholder={t("person.placeholders.first_name")}
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="patronymic"
                    label={`${t("person.labels.patronymic")}:`}
                    placeholder={t("person.placeholders.patronymic")}
                    control={form.control}
                  />
                  <FormSelect
                    name="role"
                    label={`${t("person.labels.role")}:`}
                    control={form.control}
                    required
                    placeholder={t("person.placeholders.role")}
                    className="mt-2.5"
                    options={roles}
                  />
                  {!person && isCrmUser && (
                    <FormInput
                      name="password"
                      label={`${t("labels.password")}:`}
                      control={form.control}
                      placeholder={t("placeholders.password")}
                    />
                  )}
                  {person && (
                    <Button
                      type="button"
                      onClick={handlePrint}
                      variant="secondary"
                      className="mt-2.5 min-w-[240px] self-end"
                    >
                      {t("person.buttons.print_label")}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex lg:w-1/2 w-full mt-8 lg:mt-0">
                <FormArrayPhone
                  name="phones"
                  control={form.control}
                  setValue={form.setValue}
                  label={`${t("person.labels.phone_number")}:`}
                  placeholder={t("person.placeholders.phone")}
                  required
                  fieldKey="number"
                  messengers={person?.messengers}
                  showIsMain
                  errors={form.formState.errors}
                />
              </div>
            </div>

            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                {t("location.address")}
              </p>
              <FormArrayLocation
                name="locations"
                control={form.control}
                setValue={form.setValue}
                countries={countries || []}
                onCreateCity={onCreateCity}
                onCreateCountry={onCreateCountry}
                errors={form.formState.errors}
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-20 w-full">
              <div className="mt-6 lg:w-1/2 ">
                <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                  {t("person.email_address")}
                </p>
                <FormArrayInput
                  name="emails"
                  control={form.control}
                  setValue={form.setValue}
                  placeholder={t("placeholders.email")}
                  label="Email"
                  fieldKey="email"
                  showIsMain
                  errors={form.formState.errors}
                />
              </div>
              <div className="lg:mt-6 lg:w-1/2">
                <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                  {t("person.delivery_address")}
                </p>
                <FormArrayInput
                  name="delivery_addresses"
                  control={form.control}
                  setValue={form.setValue}
                  placeholder={t("location.placeholders.address")}
                  fieldKey="address_line"
                  label={t("location.labels.address")}
                  showIsMain
                  inputClassName="min-w-[188px] lg:min-w[460px]"
                  errors={form.formState.errors}
                />
              </div>
            </div>
            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                {t("person.bank_details")}
              </p>
              <FormArrayBankDetails
                name="bank_details"
                control={form.control}
                setValue={form.setValue}
              />
            </div>
            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                {t("person.connected_contacts")}
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
                label={t("person.labels.contact")}
                displayKey="full_name"
                valueKey="id"
                saveFullObject
                placeholder={t("person.placeholders.contact")}
                searchQuery={contactQuery}
                setSearchQuery={setContactQuery}
                isOptionsLoading={contactsLoading}
                errors={form.formState.errors}
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
                  {t("person.buttons.delete")}
                </Button>
                {deletePersonMutation && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Modal
                      destructive
                      header={{
                        title: t("person.modal.delete.title"),
                        descriptionFirst: t("person.modal.delete.desc_first"),
                        descriptionSecond: t("person.modal.delete.desc_second"),
                      }}
                      footer={{
                        buttonActionTitleContinuous: t(
                          "buttons.delete_continuous"
                        ),
                        buttonActionTitle: t("buttons.delete"),
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
