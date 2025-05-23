import { CreateCountrySchema } from "@/types/location.types";

import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useLocation } from "@/api/locations/use-location";

import { Form } from "@/components/ui/form";
import FormInput from "@/components/form/form-input";
import Modal from "@/components/shared/modal/modal";

import { createCountrySchema } from "@/validators/location.validator";

interface CountryFormProps {
  isDialogOpen?: boolean;
  setIsDialogOpen?: (v: SetStateAction<boolean>) => void;
}

const CountryForm = ({ setIsDialogOpen }: CountryFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateCountrySchema>({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleOnSuccess = () => {
    setIsDialogOpen && setIsDialogOpen(false);
    form.reset();
  };

  const { createCountryMutation } = useLocation.createCountry({
    queryClient,
    handleOnSuccess,
  });

  const onSubmit = (formData: CreateCountrySchema) => {
    createCountryMutation.mutate({ ...formData });
  };
  return (
    <Modal
      header={{
        title: "Створити країну",
        descriptionFirst: "Заповніть поля і натисніть Зберігти",
      }}
      footer={{
        buttonActionTitle: "Зберігти",
        buttonActionTitleContinuous: "Зберігаю",
        submit: true,
        formId: "countryForm",
        isPending: createCountryMutation.isPending,
      }}
    >
      <Form {...form}>
        <form
          id="countryForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5"
        >
          <FormInput
            name="name"
            control={form.control}
            label="Країна"
            placeholder="Введіть країну"
            required
          />
        </form>
      </Form>
    </Modal>
  );
};

export default CountryForm;
