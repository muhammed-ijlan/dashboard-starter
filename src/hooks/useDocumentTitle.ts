import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

export const useDocumentTitle = () => {
  const { t, i18n } = useTranslation(Namespace.Common);

  useEffect(() => {
    document.title = t("appTitle");
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);
};
