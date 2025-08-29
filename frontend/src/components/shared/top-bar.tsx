import ModeToggle from "./mode-toggle";
import LanguageSelector from "./language-selector";
import UserProfile from "./profile/user-profile";
import Notifications from "./notifications";

const TopBar = ({ userId }: { userId: number }) => {
  return (
    <div className=" bg-brand-dark">
      <div className="w-full py-3 max-w-screen-2xl px-2 items-center md:mx-auto flex gap-5 justify-end">
        <div className="w-6 h-6 relative">
          <Notifications />
        </div>
        <ModeToggle />
        <div className="hidden lg:flex">
          <LanguageSelector />
        </div>
        <UserProfile userId={userId} />
      </div>
    </div>
  );
};

export default TopBar;
