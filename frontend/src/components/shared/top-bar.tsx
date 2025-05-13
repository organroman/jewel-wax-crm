import Image from "next/image";
import ModeToggle from "./mode-toggle";
import LanguageSelector from "./language-selector";

const TopBar = () => {
  return (
    <div className=" bg-brand-dark">
      <div className="w-full py-3 max-w-screen-2xl mx-auto flex gap-5 justify-end">
        <div className="w-6 h-6 relative">
          <Image src="/img/notification-bing.svg" alt="notification" fill />
        </div>
        <ModeToggle />
        <LanguageSelector />
        <Image
          src="/img/profile-circle.svg"
          alt="profile"
          width={30}
          height={30}
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default TopBar;
