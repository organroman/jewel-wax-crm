import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token");

  if (token) {
    redirect("/dashboard");
  }
  return (
    <main className="h-screen w-full flex flex-col justify-center bg-gray-100">
      <div className="mx-auto h-fit max-w-screen-2xl">{children}</div>
    </main>
  );
};

export default AuthLayout;
