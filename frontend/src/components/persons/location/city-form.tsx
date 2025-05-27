import { Country, CreateCitySchema } from "@/types/location.types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    form.reset();
  };

  const { createCityMutation } = useLocation.createCity({
    queryClient,
    handleOnSuccess,
    t,
  });

  const onSubmit = (formData: CreateCitySchema) => {
    createCityMutation.mutate({ ...formData });
  };
  return (
    <Modal
      header={{
        title: t("location.modal.city_title"),
        descriptionFirst: t("location.modal.desc_first"),
      }}
      footer={{
        buttonActionTitle: t("buttons.save"),
        buttonActionTitleContinuous: t("buttons.save_continuous"),
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
            label={t("location.labels.country")}
            placeholder={t("location.placeholders.choose_country")}
            required
          />
          <FormInput
            name="name"
            control={form.control}
            label={t("location.labels.city")}
            placeholder={t("location.placeholders.enter_city")}
            required
          />
        </form>
      </Form>
    </Modal>
  );
};

export default CityForm;
