
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ua",
    supportedLngs: ["ru", "ua"],
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie"],
      cookieMinutes: 60 * 24 * 30,
      cookieDomain:
        typeof window !== "undefined" ? window.location.hostname : "localhost",
      lookupCookie: "i18next",
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
