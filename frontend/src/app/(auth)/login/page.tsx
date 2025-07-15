"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { loginSchema, LoginSchema } from "@/validators/login-schema";

import { UseAuth } from "@/api/auth/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoIconDark from "@/assets/icons/logo-dark.svg";
import LogoIconLight from "@/assets/icons/logo-light.svg";
import { useTheme } from "next-themes";

const LoginPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = UseAuth.login();

  const onSubmit = (formData: LoginSchema) => {
    loginMutation.mutate(formData, {
      onSuccess: ({ token }) => {
        Cookies.set("token", token);
        toast.success(t("messages.success.welcome_back"));

        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to login");
      },
    });
  };

  return (
    <Card className="w-full h-full md:w-[487px] shadow-md">
      <CardHeader className="flex flex-col gap-6 items-center justify-center text-center p-6">
        {theme === "dark" ? (
          <LogoIconDark className="self-center" />
        ) : (
          <LogoIconLight className="self-center" />
        )}
        {/* <CardTitle className="text-3xl font-bold text-stone-900">
          З поверненням в CRM
        </CardTitle> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      placeholder={t("placeholders.email")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.password")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      name="password"
                      placeholder={t("placeholders.password")}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                className="w-full mt-6 bg-brand-default hover:opacity-80 transition"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex flex-row">
                    <Loader className="size-6 animate-spin text-white mr-2" />
                    <span>{t("buttons.please_wait")}...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              {loginMutation.isError && (
                <span className="text-sm text-action-alert">
                  {loginMutation.error.message}
                </span>
              )}
            </div>
          </form>
        </Form>
        <p className="mt-5 text-sm text-stone-900 text-center">
          {t("auth.forget_password")}?
          <Link href="/reset-password-token">
            <span className="text-brand-default font-bold underline hover:opacity-80 transition">
              &nbsp;{t("auth.reset_password")}
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
