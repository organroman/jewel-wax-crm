import { Person } from "@/types/person.types";

import { Separator } from "@/components/ui/separator";

import Modal from "../modal/modal";

import ProfileTheme from "./profile-theme";
import ProfileLanguage from "./profile-language";
import ProfileAvatar from "./profile-avatar";
import ProfileGeneralInfo from "./profile-general-info";
import ProfileContacts from "./profile-contacts";
import ProfileChangePassword from "./profile-change-password";

interface ProfileInfoProps {
  person: Person;
}

const ProfileInfo = ({ person }: ProfileInfoProps) => {
  return (
    <Modal hideClose>
      <div className="w-full h-full flex flex-row gap-7">
        <div className="flex flex-col w-1/3">
          <ProfileAvatar person={person} />
          <ProfileTheme />
          <ProfileLanguage />
        </div>
        <Separator orientation="vertical" className="bg-ui-border w-0.5 " />
        <div className="flex flex-col w-2/3">
          <ProfileGeneralInfo person={person} />
          <ProfileContacts person={person} />
          <ProfileChangePassword person={person} />
        </div>
      </div>
    </Modal>
  );
};

export default ProfileInfo;
