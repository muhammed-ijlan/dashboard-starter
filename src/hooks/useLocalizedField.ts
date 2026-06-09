import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/constants/const";

export const useLocalizedField = () => {
  const { i18n } = useTranslation();

  const localized = useCallback(
    <T extends object>(item: T, field: string): string => {
      const record = item as Record<string, unknown>;
      if (i18n.language === LANGUAGES.ZH) {
        const zhValue = record[`${field}Zh`];
        if (typeof zhValue === "string" && zhValue) return zhValue;
      }
      const value = record[field];
      return typeof value === "string" ? value : "";
    },
    [i18n.language],
  );

  return { localized };
};
