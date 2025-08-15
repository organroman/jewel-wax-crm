import i18n from "i18next";
import i18nextConfig from "../../../../next-i18next.config";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import InfoValue from "../typography/info-value";
import InfoLabel from "../typography/info-label";

const ProfileLanguage = () => {
  const currentLanguage = i18n.language || i18nextConfig.i18n.defaultLocale;
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    Cookies.set("i18next", lng);
    i18n.changeLanguage(lng);
  };
  return (
    <div className="flex flex-col mt-12">
      <InfoValue className="text-md font-medium mb-2">{t("person.labels.main_lang")}</InfoValue>
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5 mb-5" />
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5 items-center">
          <InfoLabel className="text-md text-text-regular">UA</InfoLabel>
          <Switch
            checked={currentLanguage === "ua"}
            onCheckedChange={() => changeLanguage("ua")}
          />
        </div>
        <div className="flex gap-2.5 items-center">
          <InfoLabel className="text-md text-text-regular">RU</InfoLabel>
          <Switch
            checked={currentLanguage === "ru"}
            onCheckedChange={() => changeLanguage("ru")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileLanguage;
