import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/components/shared/SideBar";
import TopBar from "@/components/shared/TopBar";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="w-full shrink-0">
        <TopBar />
      </div>
      <div className="flex grow h-0 w-full">
        <aside className="hidden lg:block lg:w-[84px] h-full">
          <SideBar />
        </aside>
        <div className="bg-gray-100 w-full h-full">
          <main className="h-full w-full max-w-screen-2xl m-auto overflow-y-auto px-8 pt-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
