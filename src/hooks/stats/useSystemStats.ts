import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@/constants/const";
import { Namespace } from "@/i18n/namespaces";
import { useSystem } from "../useSystem";

interface UseSystemStatsOptions {
  enabled?: boolean;
}

export const useSystemStats = (options: UseSystemStatsOptions = {}) => {
  const { enabled = true } = options;
  const { status, statusLoading: isLoading } = useSystem({ statusEnabled: enabled });
  const { t } = useTranslation(Namespace.System);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const statCards = useMemo(() => {
    return [
      {
        id: "chain-status",
        title: t("stats.chainStatus.title"),
        value: status != null ? status.chainNodesOnline : "--",
        subtitle: t("stats.chainStatus.subtitle"),
        subtitleType: "neutral" as const,
        icon: ICONS.link2,
        iconContainerClassName: "bg-blue-100 rounded-xl p-2",
        iconClassName: "text-blue-600",
      },
      {
        id: "service-status",
        title: t("stats.serviceStatus.title"),
        value: status != null ? status.servicesRunning : "--",
        valueClassName: "text-green-600",
        subtitle: t("stats.serviceStatus.subtitle"),
        subtitleType: "neutral" as const,
        icon: ICONS.server,
        iconContainerClassName: "bg-green-100 rounded-xl p-2",
        iconClassName: "text-green-600",
      },
      {
        id: "unresolved-alerts",
        title: t("stats.unresolvedAlerts.title"),
        value: status != null ? status.unresolvedAlarms : "--",
        valueClassName: "text-red-600",
        subtitleType: "negative" as const,
        icon: ICONS.alertTriangle,
        iconContainerClassName: "bg-red-100 rounded-xl p-2",
        iconClassName: "text-red-600",
      },
      {
        id: "system-load",
        title: t("stats.systemLoad.title"),
        value: status != null ? capitalize(status.systemHealth) : "--",
        subtitle:
          status != null
            ? t("stats.systemLoad.subtitle", {
                cpu: Math.round(status.cpuUsage),
                memory: Math.round(status.memoryUsage),
              })
            : undefined,
        subtitleType: "positive" as const,
        icon: ICONS.activity,
        iconContainerClassName: "bg-purple-100 rounded-xl p-2",
        iconClassName: "text-purple-600",
      },
    ];
  }, [status, t]);

  return { statCards, isLoading };
};
