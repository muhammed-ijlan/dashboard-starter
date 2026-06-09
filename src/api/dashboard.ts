import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiAlertsResponse } from "./system";

export interface DashboardSummary {
  activeUsers: number;
  activeUsersChangePct: number;
  totalInstalls: number;
  totalInstallsChangePct: number;
  todayTransactions: number;
  todayTransactionsChangePct: number;
  totalVolume: number;
  totalVolumeChangePct: number;
  volumeScope: string;
  dataDate: string;
}
interface TransactionsTrend {
  date: string;
  transactions: number;
}

export interface AssetDistribution {
  chain: string;
  chainLabel: string;
  chainLabelZh?: string;
  percentage: number;
}

export interface RecentActivity {
  txHash: string;
  type: string;
  rawType: string;
  user: string;
  amount: number;
  symbol?: string;
  tokenSymbol?: string;
  status: string;
  createdAt: string;
}

export interface TransactionVolume7d {
  date: string;
  volume: number;
}

interface TransactionVolume7dResponse {
  items: TransactionVolume7d[];
  totalVolume: number | null;
  pricedTxPct: number;
  volumeAvailable: boolean;
}

export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>(endpoints.dashboard.summary),
  getTransactionTrend: () => api.get<TransactionsTrend[]>(endpoints.dashboard.transactionTrend),
  getAssetDistribution: () => api.get<AssetDistribution[]>(endpoints.dashboard.assetDistribution),
  getRecentActivity: (lang: "en" | "zh") =>
    api.get<RecentActivity[]>(endpoints.dashboard.recentActivity, { lang }),
  getSystemAlerts: () => api.get<ApiAlertsResponse>(endpoints.dashboard.systemAlerts),
  getTransactionVolume: async (): Promise<TransactionVolume7d[]> => {
    const res = await api.get<TransactionVolume7dResponse>(endpoints.dashboard.transactionVolume7d);
    return res.items ?? [];
  },
};
