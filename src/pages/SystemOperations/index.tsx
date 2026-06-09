import { useMemo } from "react";
import { PageHeader, PillTabs } from "@/components/shared";
import { StatCard, StatCardSkeleton } from "@/components/layout";
import {
  ChainStatusTab,
  ServiceStatusTab,
  UnresolvedAlertsTab,
  SystemLogsTab,
} from "@/components/layout";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useSystemStats } from "@/hooks";
import { usePermissions } from "@/hooks";
import { PermissionKey } from "@/constants/permissionKeys";

const SystemOperations = () => {
  const { t } = useTranslation(Namespace.System);
  const { hasPermission } = usePermissions();
  const canViewSystem = hasPermission(PermissionKey.SystemView);
  const canViewAlerts = hasPermission(PermissionKey.AlertsView);
  const { statCards, isLoading } = useSystemStats({ enabled: canViewSystem });

  const tabItems = useMemo(
    () => [
      ...(canViewSystem
        ? [
            {
              key: "chain",
              label: t("tabs.chain"),
              children: <ChainStatusTab />,
            },
            {
              key: "service",
              label: t("tabs.service"),
              children: <ServiceStatusTab />,
            },
          ]
        : []),
      ...(canViewAlerts
        ? [
            {
              key: "alerts",
              label: t("tabs.alerts"),
              children: <UnresolvedAlertsTab />,
            },
          ]
        : []),
      ...(canViewSystem
        ? [{ key: "logs", label: t("tabs.logs"), children: <SystemLogsTab /> }]
        : []),
    ],
    [t, canViewSystem, canViewAlerts],
  );

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <PageHeader title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} layout="standard" showSubtitle />
            ))
          : statCards.map((card) => (
              <StatCard
                key={card.id}
                layout="standard"
                title={card.title}
                value={card.value}
                valueClassName={card.valueClassName}
                subtitle={card.subtitle}
                subtitleType={card.subtitleType}
                IconComponent={card.icon}
                iconContainerClassName={card.iconContainerClassName}
                iconClassName={card.iconClassName}
              />
            ))}
      </div>

      <PillTabs items={tabItems} defaultActiveKey="chain" />
    </div>
  );
};

export default SystemOperations;
