import {
  CreatePersonSchema,
  Person,
  PersonRole,
  UpdatePersonSchema,
} from "@/types/person.types";
import {
  createPersonSchema,
  updatePersonSchema,
} from "@/validators/person.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import dayjs from "dayjs";

import FormSwitch from "../form/form-switch";

import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";
import { Avatar } from "../ui/avatar";
import CustomAvatar from "../shared/custom-avatar";
import { getInitials } from "@/lib/utils";
import FormInput from "../form/form-input";
import FormSelect from "../form/form-select";
import { useEnumStore } from "@/stores/use-enums-store";
import FormArrayInput from "../form/form-array-input";
import FormArrayPhone from "../form/form-array-phone";
import { useLocation } from "@/api/locations/use-location";
import FormArrayLocation from "../form/form-array-location";
import { toast } from "sonner";
import FormArrayBankDetails from "../form/form-array-bank";

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
}

const PersonForm = ({ person, mutation }: PersonFormProps) => {
  const roles = useEnumStore((e) => e.getByType("person_role"));
  const schema = person ? schemaMap.update : schemaMap.create;
  const { data: countries, isLoading, error } = useLocation.getCountries();

  console.log("", person);

  const form = useForm<UpdatePersonSchema | CreatePersonSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: person?.id,
      role: person?.role || {},
      first_name: person?.first_name || "",
      last_name: person?.last_name || "",
      patronymic: person?.patronymic || "",
      is_active: person?.is_active || true,
      emails: person?.emails || [],
      phones: person?.phones || [],
      locations: person?.locations || [],
      delivery_addresses: person?.locations || [],
      contacts: person?.contacts || [],
      bank_details: person?.bank_details || [],
      password: "",
    },
  });
  const onSubmit = (formData: Person) => {
    //     mutation.mutate({ ...formData });
    console.log(formData);
  };

  console.log("form values", form.getValues());

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
            <Button type="submit">Зберігти зміни</Button>
          </div>
          <div className="flex-1 overflow-auto pr-1 mt-6">
            <div className="flex w-full justify-between sm:flex-col sm:gap-y-4 lg:flex-row">
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
                    placeholder="Іванов"
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="first_name"
                    label="Імʼя:"
                    placeholder="Степан"
                    control={form.control}
                    required
                  />
                  <FormInput
                    name="patronymic"
                    label="По батькові:"
                    placeholder="Олегович"
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
                  <Button
                    onClick={handlePrint}
                    variant="secondary"
                    className="mt-2.5 min-w-[240px] self-end"
                  >
                    Друк етикетки
                  </Button>
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
              />
            </div>
            <div className="mt-6 ">
              <p className="pb-3 border-b font-medium border-ui-border mb-2.5">
                Електрона адреса
              </p>
              <FormArrayInput
                name="emails"
                control={form.control}
                setValue={form.setValue}
                label="Email"
                fieldKey="email"
                showIsMain
              />
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
            <div className="mt-6 border-t border-ui-border flex justify-end">
              <Button
                variant="link"
                size="sm"
                className="text-action-minus text-xs mt-4"
              >
                Видалити контрагента
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonForm;
