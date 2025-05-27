"use client";

import Cookies from "js-cookie";
import i18n from "i18next";

import i18nextConfig from "../../../next-i18next.config";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const LanguageSwitcher = () => {
  const currentLanguage = i18n.language || i18nextConfig.i18n.defaultLocale;

  const changeLanguage = (lng: string) => {
    Cookies.set("i18next", lng);
    i18n.changeLanguage(lng);
  };
  return (
    <Select onValueChange={changeLanguage} defaultValue={currentLanguage}>
      <SelectTrigger className="pr-2 border-0 text-white [&_svg]:hidden">
        <SelectValue className="pr-0" />
      </SelectTrigger>
      <SelectContent className="min-w-fit">
        {i18nextConfig.i18n.locales.map((lng) => (
          <SelectItem
            key={lng}
            value={lng}
            className="w-fit focus-visible:border-0"
          >
            {lng.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
