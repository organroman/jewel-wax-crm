import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import InfoValue from "../typography/info-value";

const ProfileTheme = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col mt-12">
      <InfoValue className="text-md font-medium mb-2">
        {t("person.labels.main_theme")}
      </InfoValue>
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5 mb-5" />
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5 items-center">
          <MoonIcon className="size-5 text-text-regular" />
          <Switch
            checked={theme === "light"}
            onCheckedChange={() => setTheme("light")}
          />
        </div>
        <div className="flex gap-2.5 items-center">
          <SunIcon className="size-5 text-text-regular" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() => setTheme("dark")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileTheme;
