export const PAGE_MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "userCenter", label: "Users" },
  { key: "wallet", label: "Wallets" },
  { key: "transaction", label: "Transactions" },
  { key: "dapp", label: "DApps" },
  { key: "tronGas", label: "Tron Gas" },
  { key: "admin", label: "Admins" },
  { key: "system", label: "System" },
] as const;

export type PageModuleKey = (typeof PAGE_MODULES)[number]["key"];

const API_TO_PAGE: Record<string, PageModuleKey> = {
  dashboard: "dashboard",
  users: "userCenter",
  wallets: "wallet",
  transactions: "transaction",
  dapps: "dapp",
  trongas: "tronGas",
  admins: "admin",
  roles: "admin",
  permissions: "admin",
  system: "system",
  alerts: "system",
};

export function toPageModule(apiModule: string): PageModuleKey | undefined {
  return API_TO_PAGE[apiModule];
}

const _pageOrder = new Map(PAGE_MODULES.map((m, i) => [m.key, i]));

export function apiModuleSortIndex(apiModule: string): number {
  const pageKey = API_TO_PAGE[apiModule];
  return pageKey != null ? (_pageOrder.get(pageKey) ?? 999) : 999;
}

export const PAGE_TO_API: Record<PageModuleKey, string[]> = {
  dashboard: ["dashboard"],
  userCenter: ["users", "devices"],
  wallet: ["wallets"],
  transaction: ["transactions"],
  dapp: ["dapps"],
  tronGas: ["trongas"],
  admin: ["admins", "roles", "permissions"],
  system: ["system", "alerts"],
};
