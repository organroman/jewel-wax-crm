import type { UserConfig } from "next-i18next";

const i18nextConfig: UserConfig = {
  i18n: {
    defaultLocale: "ua",
    locales: ["ua", "ru"],
  },
  localePath: "./public/locales",
  localeStructure: "{{lng}}/{{ns}}",

  reloadOnPrerender: process.env.NODE_ENV === "development",
};

export default i18nextConfig;
