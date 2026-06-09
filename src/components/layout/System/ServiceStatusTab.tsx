import { RefreshCw, CheckCircle2, AlertCircle, XCircle, Database } from "lucide-react";
import { AppButton, AppCardLayout } from "@/components/shared";
import type { ApiService } from "@/api";
import { useSystem, useLocalizedField } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { ServiceCardSkeleton } from "./skeletons";

const statusConfig: Record<string, { bg: string; text: string; Icon: React.ElementType }> = {
  running: { bg: "bg-green-50", text: "text-green-600", Icon: CheckCircle2 },
  degraded: { bg: "bg-yellow-50", text: "text-yellow-600", Icon: AlertCircle },
  stopped: { bg: "bg-red-50", text: "text-red-600", Icon: XCircle },
};

const FALLBACK_STATUS = {
  bg: "bg-gray-50",
  text: "text-gray-600",
  Icon: AlertCircle,
};

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:min-w-25 w-full">
      <p className="text-caption text-secondary font-normal">{label}</p>
      <p className="text-body font-medium text-primary">{value}</p>
    </div>
  );
}

export function ServiceStatusTab() {
  const { t } = useTranslation(Namespace.System);
  const { localized } = useLocalizedField();
  const {
    services: data,
    servicesLoading: isLoading,
    servicesFetching: isFetching,
    refetchServices: refetch,
  } = useSystem();
  const services = data?.list ?? [];
  const isRefreshing = isFetching && !isLoading;

  return (
    <AppCardLayout className="py-6" contentClassName="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body text-gray-600">
          {t("serviceStatusTab.monitoring", { count: services.length })}
        </p>
        <AppButton
          variant="secondary"
          className="flex items-center gap-2 shrink-0"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{t("serviceStatusTab.refresh")}</span>
        </AppButton>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div
          className={`flex flex-col gap-3 transition-opacity duration-300 ${isRefreshing ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {services.map((service: ApiService) => {
            const cfg = statusConfig[service.status] ?? FALLBACK_STATUS;

            return (
              <AppCardLayout
                key={service.id}
                contentClassName="flex flex-col xl:flex-row xl:items-center gap-4 lg:gap-6 px-4! py-4 pb-4!"
              >
                <div className="flex items-center justify-between w-full xl:w-auto gap-2">
                  <div className="flex items-center gap-3 lg:w-40 shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="font-medium text-[16px] text-primary leading-6">
                      {localized(service, "name")}
                    </p>
                  </div>

                  <div className="xl:hidden shrink-0">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-w-28 rounded-full text-[13px] font-medium capitalize ${cfg.bg} ${cfg.text}`}
                    >
                      <cfg.Icon className="w-4 h-4 shrink-0" />
                      {t(`serviceStatusTab.status.${service.status}`, service.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:items-center lg:gap-10 flex-1 pt-2 border-t border-gray-100 xl:border-t-0 xl:pt-0">
                  <StatCol label={t("serviceStatusTab.fields.uptime")} value={service.uptime} />
                  <StatCol
                    label={t("serviceStatusTab.fields.responseTime")}
                    value={service.responseTime}
                  />
                  <StatCol
                    label={t("serviceStatusTab.fields.requestVolume")}
                    value={service.requestVolume}
                  />
                </div>

                <div className="hidden xl:block shrink-0">
                  <span
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-w-28 rounded-full text-[13px] font-medium capitalize ${cfg.bg} ${cfg.text}`}
                  >
                    <cfg.Icon className="w-4 h-4 shrink-0" />
                    {t(`serviceStatusTab.status.${service.status}`, service.status)}
                  </span>
                </div>
              </AppCardLayout>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400 text-body">
          {t("serviceStatusTab.empty", "No services found")}
        </div>
      )}
    </AppCardLayout>
  );
}
