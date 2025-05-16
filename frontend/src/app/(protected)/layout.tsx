import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/components/shared/side-bar";
import TopBar from "@/components/shared/top-bar";
import AppDataContainer from "@/containers/app-data-contaienr";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-hidden">
      <div className="w-full shrink-0">
        <TopBar />
      </div>
      <div className="flex h-full flex-1 w-full overflow-y-hidden">
        <aside className="hidden lg:block lg:w-[84px] h-full overflow-y-hidden">
          <SideBar />
        </aside>

        <div className="bg-ui-screen h-full flex-1 w-full overflow-y-hidden">
          <main className="h-full w-full max-w-screen-2xl m-auto px-8 py-6">
            <AppDataContainer>{children}</AppDataContainer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
