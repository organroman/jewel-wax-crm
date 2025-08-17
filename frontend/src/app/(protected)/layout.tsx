import { PersonRoleValue } from "@/types/person.types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/components/shared/side-bar";
import TopBar from "@/components/shared/top-bar";
import MobileNavBar from "@/components/shared/mobile-nav-bar";

import AppDataContainer from "@/containers/app-data-contaienr";
import { getRoleAndUserFromToken } from "@/lib/utils";

import ClientOnly from "@/components/shared/client-only";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }
  const { role, id } = getRoleAndUserFromToken(token as PersonRoleValue);

  return (
    <div className="flex flex-col h-screen w-full overflow-y-hidden">
      <div className="w-full shrink-0">
        <TopBar userId={id} />
      </div>
      <div className="flex h-full flex-1 w-full overflow-y-hidden">
        <aside className="hidden bg-ui-sidebar lg:block lg:w-[84px] h-full overflow-y-hidden">
          <ClientOnly>
            <SideBar role={role} />
          </ClientOnly>
        </aside>

        <div className="bg-ui-screen h-full flex-1 w-full overflow-y-hidden">
          <main className="h-full w-full max-w-screen-2xl m-auto px-4 md:px-6 lg:px-8 py-5 md:py-6 flex flex-col overflow-hidden">
            <AppDataContainer>{children}</AppDataContainer>
          </main>
        </div>
      </div>
      <div className="w-full flex lg:hidden">
        <ClientOnly>
          <MobileNavBar role={role} />
        </ClientOnly>
      </div>
    </div>
  );
};

export default ProtectedLayout;
