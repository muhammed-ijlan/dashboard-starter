import type { DeviceListParams } from "./userCenter";
import type { WalletListParams } from "./wallets";
import type { TransactionDetailParams, TransactionListParams } from "./transactions";
import type { SystemLogListParams } from "./system";
import type { AdminListParams } from "./admin";
import type { DAppListParams, DappCategoryListParams } from "@/api/dapps";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    permissions: () => [...queryKeys.auth.all, "permissions"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: () => [...queryKeys.dashboard.all, "summary"] as const,
    transactionTrend: () => [...queryKeys.dashboard.all, "transactionTrend"] as const,
    assetDistribution: () => [...queryKeys.dashboard.all, "assetDistribution"] as const,
    recentActivity: (lang: string) => [...queryKeys.dashboard.all, "recentActivity", lang] as const,
    systemAlerts: () => [...queryKeys.dashboard.all, "systemAlerts"] as const,
    transactionVolume7d: () => [...queryKeys.dashboard.all, "transactionVolume7d"] as const,
  },
  userCenter: {
    all: ["userCenter"] as const,
    summary: () => [...queryKeys.userCenter.all, "summary"] as const,
    devices: (params: DeviceListParams) =>
      [...queryKeys.userCenter.all, "devices", params] as const,
  },
  walletCenter: {
    all: ["walletCenter"] as const,
    summary: () => [...queryKeys.walletCenter.all, "summary"] as const,
    wallets: (params: WalletListParams) =>
      [...queryKeys.walletCenter.all, "wallets", params] as const,
    detail: (address: string) => [...queryKeys.walletCenter.all, "detail", address] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    summary: () => [...queryKeys.transactions.all, "summary"] as const,
    volume24h: () => [...queryKeys.transactions.all, "volume24h"] as const,
    volume7d: () => [...queryKeys.transactions.all, "volume7d"] as const,
    list: (params?: TransactionListParams) =>
      [...queryKeys.transactions.all, "list", params] as const,
    detail: (txHash: string, params?: TransactionDetailParams) =>
      [...queryKeys.transactions.all, "detail", txHash, params ?? {}] as const,
  },
  system: {
    all: ["system"] as const,
    status: () => [...queryKeys.system.all, "status"] as const,
    chains: () => [...queryKeys.system.all, "chains"] as const,
    services: () => [...queryKeys.system.all, "services"] as const,
    logs: (params?: SystemLogListParams) => [...queryKeys.system.all, "logs", params] as const,
  },
  admin: {
    all: ["admin"] as const,
    roles: () => [...queryKeys.admin.all, "roles"] as const,
    role: (id: number) => [...queryKeys.admin.all, "role", id] as const,
    permissions: () => [...queryKeys.admin.all, "permissions"] as const,
    rolePermissions: (roleId: number) =>
      [...queryKeys.admin.all, "rolePermissions", roleId] as const,
    summary: () => [...queryKeys.admin.all, "summary"] as const,
    list: (params?: AdminListParams) => [...queryKeys.admin.all, "list", params] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: () => [...queryKeys.alerts.all, "list"] as const,
  },
  dapps: {
    all: ["dapps"] as const,
    summary: () => [...queryKeys.dapps.all, "summary"] as const,
    list: (params?: DAppListParams) => [...queryKeys.dapps.all, "list", params] as const,
    types: () => [...queryKeys.dapps.all, "types"] as const,
    categories: (params?: DappCategoryListParams) =>
      [...queryKeys.dapps.all, "categories", params] as const,
    category: (id: number) => [...queryKeys.dapps.all, "category", id] as const,
  },
  tronGas: {
    all: ["tronGas"] as const,
    overview: () => [...queryKeys.tronGas.all, "overview"] as const,
  },
} as const;
