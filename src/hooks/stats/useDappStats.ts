import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useDapps } from "../useDapps";

export const useDappStats = () => {
  const { summary, summaryLoading: isLoading } = useDapps();
  const { t } = useTranslation([Namespace.Dapps, Namespace.Common]);

  const stats = useMemo(() => {
    if (!summary) return [];

    return [
      {
        id: "dapp_total",
        title: t("statCard.title.totalDapps"),
        value: summary?.totalDapps?.toLocaleString() || "0",
      },
      {
        id: "dapp_visible",
        title: t("statCard.title.visible"),
        value: summary.onDisplay?.toLocaleString() || "0",
        valueClassName: "text-green-600",
      },
      {
        id: "dapp_hits",
        title: t("statCard.title.totalClicks"),
        value: summary?.totalHits?.toLocaleString() || "0",
        valueClassName: "text-blue-500",
      },
      {
        id: "dapp_users",
        title: t("statCard.title.totalFavs", "Total Favorites"),
        value: summary?.totalFavorites?.toLocaleString() || "0",
        valueClassName: "text-purple-500",
      },
    ];
  }, [summary, t]);

  return { stats, isLoading };
};
