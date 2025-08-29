import { PersonRoleValue } from "@/types/person.types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/components/shared/side-bar";
import TopBar from "@/components/shared/top-bar";
import MobileNavBar from "@/components/shared/mobile-nav-bar";
import ClientOnly from "@/components/shared/client-only";

import UnreadProvider from "@/providers/unread-provider";

import { getRoleAndUserFromToken } from "@/lib/utils";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }
  const { role, id } = getRoleAndUserFromToken(token as PersonRoleValue);

  return (
    <div className="flex flex-col h-screen w-full overflow-y-hidden">
      <ClientOnly>
        <UnreadProvider>
          <div className="w-full shrink-0">
            <TopBar userId={id} role={role} />
          </div>
          <div className="flex h-full flex-1 w-full overflow-y-hidden">
            <aside className="hidden bg-ui-sidebar lg:block lg:w-[84px] h-full overflow-y-hidden">
              <SideBar role={role} />
            </aside>
            <div className="bg-ui-screen h-full flex-1 w-full overflow-y-hidden">
              <main className="h-full w-full max-w-screen-2xl m-auto px-4 md:px-6 lg:px-8 py-5 md:py-6 flex flex-col overflow-hidden">
                {children}
              </main>
            </div>
          </div>
          <div className="w-full flex lg:hidden">
            <MobileNavBar role={role} />
          </div>
        </UnreadProvider>
      </ClientOnly>
    </div>
  );
};

export default ProtectedLayout;
