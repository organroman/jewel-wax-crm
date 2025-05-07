"use client";

import { loginSchema, LoginSchema } from "@/validators/login-schema";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseAuth } from "@/api/auth/use-auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Loader } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("token");
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, []);

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
      <CardHeader className="flex items-center justify-center text-center p-6">
        <CardTitle className="text-2xl text-stone-900">
          З поверненням!
        </CardTitle>
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
                className="w-full mt-6"
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
        <p>
          Забули пароль?
          <Link href="/reset-password-token">
            <span className="text-blue-700">&nbsp;Відновити пароль</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
