import i18n from "i18next";
import { LANGUAGE_STORAGE_KEY } from "@/constants/const";

export const toggleLanguage = () => {
  const current = i18n.language;

  const next = current.startsWith("zh") ? "en" : "zh";

  i18n.changeLanguage(next);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  } catch (error) {
    console.warn("[i18n] Unable to persist language to localStorage", error);
  }
};
