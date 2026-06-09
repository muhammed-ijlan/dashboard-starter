import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@/constants/const";
import { formatCompact } from "@/utils";
import { Namespace } from "@/i18n/namespaces";
import { useUserCenter } from "../useUserCenter";

export const useUserCenterStats = () => {
  const { t } = useTranslation(Namespace.Users);
  const { summary, summaryLoading: isLoading } = useUserCenter();

  const statCards = useMemo(() => {
    const newToday = summary?.newUsersToday ?? 0;
    const yesterdayChange =
      summary?.newUsersTodayChangePct !== undefined && summary?.newUsersTodayChangePct !== null
        ? Number(summary.newUsersTodayChangePct.toFixed(1))
        : null;

    const newTodaySign = newToday > 0 ? "+" : newToday < 0 ? "" : "";
    const newTodayValueColor =
      newToday > 0 ? "text-[#00A63E]" : newToday < 0 ? "text-[#E7000B]" : undefined;

    const changeSign = yesterdayChange !== null && yesterdayChange > 0 ? "+" : "";
    const changeType: "positive" | "negative" | "neutral" =
      yesterdayChange !== null && yesterdayChange > 0
        ? "positive"
        : yesterdayChange !== null && yesterdayChange < 0
          ? "negative"
          : "neutral";

    return [
      {
        id: "total_users",
        title: t("statCard.title.totalUsers"),
        value: formatCompact(summary?.totalUsers ?? 0),
        valueColor: undefined as string | undefined,
        subtitle: t("statCard.subtitle.totalUsers", {
          count: summary?.totalInstalls ?? 0,
        }),
        subtitleType: "neutral" as const,
        icon: ICONS.users,
        iconBgColor: "bg-blue-50",
        iconColor: "text-blue-500",
      },
      {
        id: "new_today",
        title: t("statCard.title.newToday"),
        value: `${newTodaySign}${formatCompact(newToday)}`,
        valueColor: newTodayValueColor,
        subtitle:
          yesterdayChange !== null
            ? t("statCard.subtitle.newToday", { count: `${changeSign}${yesterdayChange}%` })
            : undefined,
        subtitleType: changeType,
        icon: ICONS.trending,
        iconBgColor: "bg-green-50",
        iconColor: "text-green-500",
      },
      {
        id: "active_users",
        title: t("statCard.title.activeToday"),
        value: formatCompact(summary?.activeUsers ?? 0),
        valueColor: "text-[#9810FA]" as string | undefined,
        subtitle: t("statCard.subtitle.activeToday", { days: 7 }),
        subtitleType: "neutral" as const,
        icon: ICONS.activity,
        iconBgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
    ] as const;
  }, [summary, t]);

  return {
    summary,
    statCards,
    isLoading,
  };
};
