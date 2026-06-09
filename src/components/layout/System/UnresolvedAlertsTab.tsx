import { RefreshCw, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { AppButton, AppCardLayout } from "@/components/shared";
import type { ApiAlert } from "@/api";
import { alertsApi } from "@/api";
import { useSystem, usePermissions, useLocalizedField } from "@/hooks";
import { formatDate } from "@/utils";
import { PermissionKey } from "@/constants/permissionKeys";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AlertCardSkeleton } from "./skeletons";
import { exportAllToExcel } from "@/utils/exportExcel";
import { ALERT_EXPORT_COLUMNS } from "@/constants/exportColumns";

const severityConfig: Record<string, { badge: string; icon: string; Icon: React.ElementType }> = {
  critical: {
    badge: "bg-red-100 text-red-600",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
  error: {
    badge: "bg-red-100 text-red-500",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
  warning: {
    badge: "bg-yellow-100 text-yellow-600",
    icon: "text-yellow-500",
    Icon: AlertCircle,
  },
  info: {
    badge: "bg-blue-100 text-blue-500",
    icon: "text-blue-500",
    Icon: CheckCircle2,
  },
  success: {
    badge: "bg-green-100 text-green-600",
    icon: "text-green-500",
    Icon: CheckCircle2,
  },
};

const FALLBACK_SEVERITY = {
  badge: "bg-gray-100 text-gray-500",
  icon: "text-gray-400",
  Icon: AlertCircle,
};

export function UnresolvedAlertsTab() {
  const { t } = useTranslation([Namespace.System, Namespace.Common]);
  const { localized } = useLocalizedField();
  const {
    alerts: data,
    alertsLoading: isLoading,
    alertsFetching: isFetching,
    refetchAlerts: refetch,
    resolveAlert,
    resolveAlertPending: isPending,
  } = useSystem();
  const isRefreshing = isFetching && !isLoading;
  const { hasPermission } = usePermissions();
  const canManageAlerts = hasPermission(PermissionKey.AlertsManage);

  const alerts = data?.list ?? [];
  const total = alerts.length;
  const unresolved = alerts.filter((a) => !a.resolved).length;

  return (
    <AppCardLayout contentClassName="py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body font-normal text-muted">
          {t("unresolvedAlertsTab.summary", { total, unresolved })}
        </p>

        <div className="flex gap-2 shrink-0">
          <AppButton
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t("unresolvedAlertsTab.actions.refresh")}</span>
          </AppButton>
          <AppButton
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() =>
              exportAllToExcel(
                async () => {
                  const res = await alertsApi.getAlerts();
                  return res.list.map((alert) => ({
                    ...alert,
                    message: localized(alert, "message") || alert.messageLabel || alert.message,
                    severity: t(
                      `unresolvedAlertsTab.severity.${alert.severity.toLowerCase()}`,
                      alert.severityLabel ?? alert.severity,
                    ),
                    resolved: alert.resolved
                      ? t("unresolvedAlertsTab.status.resolved")
                      : t("unresolvedAlertsTab.status.unresolved"),
                  }));
                },
                ALERT_EXPORT_COLUMNS,
                "alerts",
              )
            }
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{t("common:actions.export")}</span>
          </AppButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <AlertCardSkeleton key={i} />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div
          className={`flex flex-col gap-3 transition-opacity duration-300 ${isRefreshing ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {alerts.map((alert: ApiAlert) => {
            const severityKey = alert.severity.toLowerCase();
            const cfg = severityConfig[severityKey] ?? FALLBACK_SEVERITY;
            return (
              <AppCardLayout
                key={alert.id}
                contentClassName={`px-4! py-4! flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 rounded-[inherit] overflow-hidden ${
                  alert.resolved ? "bg-[#F9FAFB]" : ""
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                  <cfg.Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.icon}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-caption font-medium px-2.5 py-0.5 rounded-full ${cfg.badge}`}
                      >
                        {t(`unresolvedAlertsTab.severity.${severityKey}`, alert.severity)}
                      </span>
                      {alert.resolved && (
                        <span className="text-caption font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {t("unresolvedAlertsTab.status.resolved")}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[15px] text-gray-900 mb-1">
                      {localized(alert, "message")}
                    </p>
                    <div className="flex items-center gap-1.5 text-caption text-gray-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatDate(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {!alert.resolved && canManageAlerts && (
                  <div className="ml-8 sm:ml-0 mt-1 sm:mt-0 shrink-0">
                    <button
                      disabled={isPending}
                      onClick={() => resolveAlert(String(alert.id))}
                      className="w-full sm:w-auto px-4 py-1.5 rounded-lg border border-[#155DFC] text-[#155DFC] text-[13px] font-medium hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("unresolvedAlertsTab.actions.process")}
                    </button>
                  </div>
                )}
              </AppCardLayout>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400 text-body">
          {t("unresolvedAlertsTab.empty", "No alerts found")}
        </div>
      )}
    </AppCardLayout>
  );
}
