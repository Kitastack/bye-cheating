import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationID from "@/locales/id.json";
import translationEN from "@/locales/en.json";

const locales = {
  id: {
    ns1: translationID,
  },
  en: {
    ns1: translationEN,
  },
};

i18n.use(initReactI18next).init({
  lng: "id",
  resources: locales,
  defaultNS: "ns1",
  ns: ["ns1", "ns2"],
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
