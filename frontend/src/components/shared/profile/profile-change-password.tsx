import { Person } from "@/types/person.types";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "@/validators/auth.validator";
import { UseAuth } from "@/api/auth/use-auth";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/form-input";
import { Form } from "@/components/ui/form";

import InfoValue from "../typography/info-value";

interface ProfileChangePasswordProps {
  person: Person;
}

const ProfileChangePassword = ({ person }: ProfileChangePasswordProps) => {
  const { t } = useTranslation();

  const mainEmail = person.emails.find((e) => e.is_main) || person.emails[0];

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = UseAuth.changePassword();

  const onSubmit = (formData: ChangePasswordSchema) => {
    changePasswordMutation.mutate(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: ({ token }) => {
          Cookies.set("token", token);
          toast.success(t("messages.success.password_changed"));
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to change password");
        },
      }
    );
  };

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between mt-9">
        <InfoValue className="text-md font-medium">
          {t("auth.account_details")}
        </InfoValue>
      </div>
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5 mb-5 mt-2.5" />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row gap-5 items-center justify-end ">
          <Label htmlFor="email-login">{t("auth.login")}:</Label>
          <Input
            id="email-login"
            value={mainEmail?.email ?? ""}
            className="min-w-[240px] max-w-[240px] h-8 rounded-xs"
            disabled
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col justify-end"
          >
            <FormInput
              name="currentPassword"
              type="password"
              control={form.control}
              label={`${t("auth.password")}:`}
              inputStyles="min-w-[240px] max-w-[240px] h-8 rounded-xs"
              labelPosition="left"
            />
            <FormInput
              name="newPassword"
              type="password"
              control={form.control}
              label={`${t("auth.new_password")}:`}
              inputStyles="min-w-[240px] max-w-[240px] h-8 rounded-xs"
              labelPosition="left"
            />
            <FormInput
              name="confirmPassword"
              type="password"
              control={form.control}
              label={`${t("auth.confirm_new_password")}:`}
              inputStyles="min-w-[240px] max-w-[240px] h-8 rounded-xs"
              labelPosition="left"
              labelClassName="text-nowrap"
            />

            <Button
              variant="link"
              type="submit"
              className="self-end text-xs font-normal text-action-plus underline cursor-pointer hover:text-action-plus/85 mb-2.5"
            >
              {t("auth.change_password")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileChangePassword;
