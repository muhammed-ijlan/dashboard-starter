import { api, buildPaginatedQueryParams } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PaginationMeta, PaginationParams } from "@/api/types";
import type { WalletStatus } from "@/types";

export interface WalletSummary {
  totalWallets: number;
  totalBalanceUsd: number;
  activeWallets: number;
  frozenWallets: number;
}

export interface WalletListParams extends PaginationParams {
  page: number;
  limit: number;
}

export interface WalletExportParams {
  search?: string;
  address?: string;
  chain?: string;
  status?: "active" | "frozen";
  exportLimit?: number;
  sort?: "created_at" | "last_active" | "chain";
  order?: "asc" | "desc";
}

export interface WalletResponse {
  address: string;
  userId: string;
  chain: string;
  asset?: {
    symbol: string;
  };
  balance: number;
  balanceUsd: number;
  change24hPct: number;
  transactions: number;
  status: string;
  lastActive: string;
}

interface ApiPaginatedResponse {
  list: WalletResponse[];
  pagination: PaginationMeta;
}

export interface WalletDetailChain {
  chain: string;
  chainLabel: string;
  balance: number;
  balanceUsd: number;
  change24h: string;
  status: string;
  createdAt: string;
  lastActive: string;
}

export interface WalletDetailResponse {
  address: string;
  chains: WalletDetailChain[];
  lastActive: string;
  totalBalance: number;
  totalBalanceUsd: number;
  userId: string;
}

const getStatusMap = (status?: string): WalletStatus => {
  switch (status?.toLowerCase()) {
    case "active":
    case "normal":
      return "Normal";
    case "frozen":
      return "Frozen";
    case "monitoring":
      return "Monitoring";
    default:
      return "Monitoring";
  }
};

export const walletApi = {
  getSummary: () => api.get<WalletSummary>(endpoints.walletCenter.summary),

  getWalletDetail: (address: string) =>
    api.get<WalletDetailResponse>(endpoints.walletCenter.detail(address)),

  exportWallets: (params: WalletExportParams = {}) => {
    const queryParams: Record<string, string | number> = {};
    if (params.search) queryParams.search = params.search;
    if (params.address) queryParams.address = params.address;
    if (params.chain) queryParams.chain = params.chain;
    if (params.status) queryParams.status = params.status;
    if (params.exportLimit != null) queryParams.exportLimit = params.exportLimit;
    if (params.sort) queryParams.sort = params.sort;
    if (params.order) queryParams.order = params.order;

    return api.download(endpoints.walletCenter.export, "wallets.csv", queryParams);
  },

  getWallets: async (params: WalletListParams) => {
    const responseData = await api.get<ApiPaginatedResponse>(
      endpoints.walletCenter.wallets,
      buildPaginatedQueryParams(params),
    );

    const rawWallets = Array.isArray(responseData?.list) ? responseData.list : [];

    return {
      total: responseData.pagination?.total ?? 0,
      data: rawWallets.map((wallet) => ({
        id: `${wallet.address}-${wallet.chain || "unknown"}`,
        currency: wallet.asset?.symbol ?? "",
        address: wallet.address || "Unknown",
        user: wallet.userId || "Anonymous",
        transactions: Number(wallet.transactions) || 0,
        lastActivity: wallet.lastActive || "-",
        status: getStatusMap(wallet.status),
        balance: Number(wallet.balance || 0),
        balanceUSD: Number(wallet.balanceUsd || 0),
        change24h: Number(wallet.change24hPct) || 0,
        shortAddress: wallet.address
          ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
          : "",
      })),
    };
  },
};
