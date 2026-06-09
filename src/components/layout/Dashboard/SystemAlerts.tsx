import React from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { Link } from "react-router-dom";
import { AppCardLayout } from "@/components/shared";
import { useDashboard, useLocalizedField } from "@/hooks";
import { routes } from "@/routes/paths";
import type { ApiAlert } from "@/api";
import { formatTimeAgo } from "@/utils";
import { SystemAlertsSkeleton } from "./SystemAlertsSkeleton";

const severityStyles: Record<string, { icon: string; bg: string }> = {
  warning: { icon: "text-[#D08700]", bg: "bg-[#FEF9C2]" },
  info: { icon: "text-[#155DFC]", bg: "bg-[#DBEAFE]" },
  error: { icon: "text-[#E7000B]", bg: "bg-[#FFE2E2]" },
};

const fallbackStyle = { icon: "text-gray-600", bg: "bg-gray-100" };

export const SystemAlerts: React.FC = () => {
  const { t, i18n } = useTranslation(Namespace.Dashboard);
  const { systemAlerts, isLoading } = useDashboard();
  const { localized } = useLocalizedField();

  const alerts = (systemAlerts?.list ?? []) as ApiAlert[];

  return (
    <AppCardLayout
      contentClassName="relative overflow-y-auto"
      title={t("sysAlerts")}
      icon={<AlertCircle className="w-5 h-5" />}
      action={
        <Link
          to={`/${routes.SYSTEM}`}
          className="cursor-pointer text-body font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
        >
          {t("action.viewAll")}
        </Link>
      }
      className="h-100"
    >
      {isLoading ? (
        <SystemAlertsSkeleton />
      ) : (
        <div className="flex flex-col">
          {alerts.length === 0 ? (
            <div className="text-center text-secondary text-sm py-6">{t("noAlerts")}</div>
          ) : (
            alerts.map((alert) => {
              const style = severityStyles[alert.severity] ?? fallbackStyle;

              return (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 py-4 border-b border-surface-muted last:border-b-0 last:pb-0 first:pt-0"
                >
                  <div
                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${style.bg}`}
                  >
                    <AlertCircle className={`w-5 h-5 ${style.icon}`} />
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-body font-normal text-primary">
                      {localized(alert, "message")}
                    </span>
                    <span className="text-caption font-normal text-secondary">
                      {formatTimeAgo(alert.createdAt, i18n.language)}
                    </span>
                  </div>

                  {alert.resolved ? (
                    <span className="text-caption font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 shrink-0">
                      {t("alert.resolved")}
                    </span>
                  ) : (
                    <span className="text-caption font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 shrink-0">
                      {t("alert.unresolved")}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </AppCardLayout>
  );
};
