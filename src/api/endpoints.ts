// Endpoint path constants — update these to match your backend API routes.
export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },
  dashboard: {
    summary: "/dashboard",
    transactionTrend: "/dashboard/transaction-trend",
    assetDistribution: "/dashboard/asset-distribution",
    recentActivity: "/dashboard/recent-activity",
    transactionVolume7d: "/dashboard/volume-7d",
  },
} as const;
