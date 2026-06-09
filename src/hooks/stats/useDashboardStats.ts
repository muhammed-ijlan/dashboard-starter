import { useMemo } from "react";
import { ICONS } from "@/constants/const";
import { formatCompact } from "@/utils";
import { useDashboard } from "../useDashboard";

export const useDashboardStats = () => {
  const { summary, isLoading } = useDashboard();

  const statCards = useMemo(() => {
    return [
      {
        id: "total_users",
        title: "statCard.title.totalUsers",
        value: formatCompact(summary?.totalInstalls || 0),
        trendValue: summary?.totalInstallsChangePct || 0,
        isPositive: (summary?.totalInstallsChangePct || 0) >= 0,
        icon: ICONS.users,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        id: "active_wallets",
        title: "statCard.title.activeUsers",
        value: formatCompact(summary?.activeUsers || 0),
        trendValue: summary?.activeUsersChangePct || 0,
        isPositive: (summary?.activeUsersChangePct || 0) >= 0,
        icon: ICONS.wallet,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        id: "today_transactions",
        title: "statCard.title.todaysTrx",
        value: formatCompact(summary?.todayTransactions || 0),
        trendValue: summary?.todayTransactionsChangePct || 0,
        isPositive: (summary?.todayTransactionsChangePct || 0) >= 0,
        icon: ICONS.transaction,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ] as const;
  }, [summary]);

  return {
    statCards,
    isLoading,
  };
};
