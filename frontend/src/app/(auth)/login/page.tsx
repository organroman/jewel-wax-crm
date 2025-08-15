import ClientOnly from "@/components/shared/client-only";
import LoginClient from "./login-client";

const LoginPage = async () => {
  return (
    <ClientOnly>
      <LoginClient />
    </ClientOnly>
  );
};

export default LoginPage;
