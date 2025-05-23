import { Country, CreateCitySchema } from "@/types/location.types";

import { SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useLocation } from "@/api/locations/use-location";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/form/form-select";
import FormInput from "@/components/form/form-input";
import Modal from "@/components/shared/modal/modal";

import { createCitySchema } from "@/validators/location.validator";

interface CityFormProps {
  country?: Country;
  countries: Country[];
  isDialogOpen?: boolean;
  setIsDialogOpen?: (v: SetStateAction<boolean>) => void;
}

const CityForm = ({ country, setIsDialogOpen, countries }: CityFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateCitySchema>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {
      country: country ? { label: country.name, value: country.id } : undefined,
      name: "",
    },
  });

  useEffect(() => {
    country &&
      form.setValue("country", { label: country.name, value: country.id });
  }, [country]);

  const handleOnSuccess = () => {
    setIsDialogOpen && setIsDialogOpen(false);
    form.reset()
  };


  const { createCityMutation } = useLocation.createCity({
    queryClient,
    handleOnSuccess,
  });

  const onSubmit = (formData: CreateCitySchema) => {
    createCityMutation.mutate({ ...formData });
  };
  return (
    <Modal
      header={{
        title: "Створити місто",
        descriptionFirst: "Заповніть поля і натисніть Зберігти",
      }}
      footer={{
        buttonActionTitle: "Зберігти",
        buttonActionTitleContinuous: "Зберігаю",
        submit: true,
        formId: "cityForm",
        isPending: createCityMutation.isPending,
      }}
    >
      <Form {...form}>
        <form
          id="cityForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5"
        >
          <FormSelect
            name="country"
            control={form.control}
            options={countries.map((c) => ({ label: c.name, value: c.id }))}
            label="Країна"
            placeholder="Оберіть країну"
            required
          />
          <FormInput
            name="name"
            control={form.control}
            label="Місто"
            placeholder="Введіть місто"
            required
          />
        </form>
      </Form>
    </Modal>
  );
};

export default CityForm;
