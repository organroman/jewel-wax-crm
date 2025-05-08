"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";

import { loginSchema, LoginSchema } from "@/validators/login-schema";

import { toast } from "sonner";
import { UseAuth } from "@/api/auth/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const LoginPage = () => {
  const router = useRouter();

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
        toast.success("Welcome back!");

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
        <Image
          src="/img/logo.png"
          alt="logo"
          width={80}
          height={80}
          className="text-center"
        />
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
                      placeholder="Введіть свою пошту"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      name="password"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                className="w-full mt-6 bg-lime-600 hover:bg-lime-700 transition"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex flex-row">
                    <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              {loginMutation.isError && (
                <span className="text-sm text-red-500">
                  {loginMutation.error.message}
                </span>
              )}
            </div>
          </form>
        </Form>
        <p className="mt-5 text-sm text-stone-900 text-center">
          Забули пароль?
          <Link href="/reset-password-token">
            <span className="text-lime-600 font-bold underline hover:text-lime-700 transition">
              &nbsp;Відновити пароль
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
