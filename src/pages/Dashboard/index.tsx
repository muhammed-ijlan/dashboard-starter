import React from "react";
import {
  RecentActivity,
  StatCard,
  StatCardSkeleton,
  // SystemAlerts,
  TransactionChart,
  // VolumeStatisticsChart,
  AssetDistributionChart,
} from "@/components/layout";
import { PageHeader } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useDashboardStats } from "@/hooks";
import { formatCompact } from "@/utils";

const Dashboard: React.FC = () => {
  const { t } = useTranslation(Namespace.Dashboard);
  const { statCards, isLoading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <PageHeader title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} layout="dashboard" size="lg" />
            ))
          : statCards.map((stat) => {
              const status = stat.isPositive ? "up" : "down";

              const timeframeKey = stat.id === "today_transactions" ? "vs_yesterday" : "vs_month";

              const trendLabel = t(`statCard.trend.${status}`, {
                val: formatCompact(Math.abs(stat.trendValue)),
                timeframe: t(`statCard.trend.${timeframeKey}`),
              });

              return (
                <StatCard
                  key={stat.id}
                  layout="dashboard"
                  size="lg"
                  title={t(stat.title)}
                  value={stat.value}
                  subtitle={trendLabel}
                  subtitleType={stat.isPositive ? "positive" : "negative"}
                  IconComponent={stat.icon}
                  iconContainerClassName={stat.iconBgColor}
                  iconClassName={stat.iconColor}
                />
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TransactionChart />
        <AssetDistributionChart />
      </div>

      {/* <VolumeStatisticsChart /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentActivity />
        {/* <SystemAlerts /> */}
      </div>
    </div>
  );
};

export default Dashboard;
