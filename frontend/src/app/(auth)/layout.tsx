"use client";
import { useAuthContext } from "@/providers/auth-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <Image src="/img/logo.png" alt="logo" width={80} height={80} />
      <div className="mx-auto h-full max-w-screen-2xl p-4">{children}</div>
    </main>
  );
};

export default AuthLayout;
