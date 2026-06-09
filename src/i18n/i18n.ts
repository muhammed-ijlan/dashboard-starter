import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { LANGUAGES, LANGUAGE_STORAGE_KEY } from "@/constants/const";
import { Namespace } from "@/i18n/namespaces";

type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

const SUPPORTED_LANGUAGES: Language[] = Object.values(LANGUAGES);

const isValidLanguage = (lng: unknown): lng is Language => {
  return typeof lng === "string" && SUPPORTED_LANGUAGES.includes(lng as Language);
};

function readSavedLanguage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn("[i18n] Unable to read saved language from localStorage", error);
    return null;
  }
}

const savedLanguage = readSavedLanguage();

const initialLanguage: Language = isValidLanguage(savedLanguage) ? savedLanguage : LANGUAGES.EN;

i18n
  .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,

    lng: initialLanguage,
    fallbackLng: LANGUAGES.EN,

    supportedLngs: SUPPORTED_LANGUAGES,

    ns: [Namespace.Common],
    defaultNS: Namespace.Common,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
