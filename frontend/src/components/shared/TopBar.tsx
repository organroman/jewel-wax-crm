import Image from "next/image";
import React from "react";
import ModeToggle from "./ModeToggle";
import LanguageSelector from "./LanguageSelector";

const TopBar = () => {
  return (
    <div className=" bg-brand-dark">
      <div className="w-full py-3 max-w-screen-2xl mx-auto flex gap-5 justify-end">
        <Image
          src="/img/notification-bing.svg"
          alt="notification"
          width={24}
          height={24}
          className="w-auto h-auto"
        />
        <ModeToggle />
        <LanguageSelector />
        <Image
          src="/img/profile-circle.svg"
          alt="notification"
          width={30}
          height={30}
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default TopBar;
