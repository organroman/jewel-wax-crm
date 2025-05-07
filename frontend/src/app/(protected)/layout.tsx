import { AuthGuard } from "@/components/shared/AuthGuard";
import SideBar from "@/components/shared/SideBar";
import TopBar from "@/components/shared/TopBar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
};

export default ProtectedLayout;
