import { dashboardApi, queryKeys } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { POLLING_INTERVAL } from "@/constants/polling";
import { LANGUAGES } from "@/constants/const";

export const useDashboard = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === LANGUAGES.ZH ? LANGUAGES.ZH : LANGUAGES.EN;

  const summaryQuery = useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: dashboardApi.getSummary,
    refetchInterval: POLLING_INTERVAL,
  });

  const trendQuery = useQuery({
    queryKey: queryKeys.dashboard.transactionTrend(),
    queryFn: dashboardApi.getTransactionTrend,
  });

  const assetDistributionQuery = useQuery({
    queryKey: queryKeys.dashboard.assetDistribution(),
    queryFn: dashboardApi.getAssetDistribution,
  });

  const recentActivityQuery = useQuery({
    queryKey: queryKeys.dashboard.recentActivity(lang),
    queryFn: () => dashboardApi.getRecentActivity(lang),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const systemAlertsQuery = useQuery({
    queryKey: queryKeys.dashboard.systemAlerts(),
    queryFn: dashboardApi.getSystemAlerts,
    refetchInterval: POLLING_INTERVAL,
  });

  const transactionVolume7d = useQuery({
    queryKey: queryKeys.dashboard.transactionVolume7d(),
    queryFn: dashboardApi.getTransactionVolume,
  });

  const isLoading = useMemo(
    () =>
      summaryQuery.isLoading ||
      trendQuery.isLoading ||
      assetDistributionQuery.isLoading ||
      recentActivityQuery.isLoading ||
      systemAlertsQuery.isLoading ||
      transactionVolume7d.isLoading,
    [
      summaryQuery.isLoading,
      trendQuery.isLoading,
      assetDistributionQuery.isLoading,
      recentActivityQuery.isLoading,
      systemAlertsQuery.isLoading,
      transactionVolume7d.isLoading,
    ],
  );

  const isError = useMemo(
    () =>
      summaryQuery.isError ||
      trendQuery.isError ||
      assetDistributionQuery.isError ||
      recentActivityQuery.isError ||
      systemAlertsQuery.isError ||
      transactionVolume7d.isError,
    [
      summaryQuery.isError,
      trendQuery.isError,
      assetDistributionQuery.isError,
      recentActivityQuery.isError,
      systemAlertsQuery.isError,
      transactionVolume7d.isError,
    ],
  );

  return {
    summary: summaryQuery.data,
    trend: trendQuery.data,
    assetDistribution: assetDistributionQuery.data,
    recentActivity: recentActivityQuery.data,
    systemAlerts: systemAlertsQuery.data,
    transactionVolume7d: transactionVolume7d.data,

    isLoading,
    isError,

    refetchAll: () => {
      summaryQuery.refetch();
      trendQuery.refetch();
      assetDistributionQuery.refetch();
      recentActivityQuery.refetch();
      systemAlertsQuery.refetch();
      transactionVolume7d.refetch();
    },
  };
};
