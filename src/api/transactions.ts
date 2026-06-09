import { api, buildPaginatedQueryParams } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PaginationMeta, PaginationParams } from "@/api/types";

export interface TransactionSummary {
  total: number;
  volume: number;
  pending: number;
  failed: number;
  successRate: number;
}

export interface VolumePoint24h {
  hour: string;
  volume: number;
}

export interface VolumePoint7d {
  date: string;
  volume: number;
}

interface VolumePoint7dResponse {
  items: VolumePoint7d[];
  totalVolume: number | null;
  pricedTxPct: number;
  volumeAvailable: boolean;
}

export interface ApiTransaction {
  walletId?: string;
  deviceId?: string;
  txHash: string;
  chain?: string;
  user: string;
  userId: string;
  walletAddress: string;
  type: string;
  typeKey?: string;
  amount: number;
  amountUsd: number;
  tokenSymbol?: string;
  fee: number;
  feeSymbol?: string;
  feeText?: string;
  gasFee?: number;
  gasFeeSymbol?: string;
  gasFeeText?: string;
  confirmations: number;
  status: string;
  statusLabel: string;
  time: string;
}

export interface TransactionListResponse {
  list: ApiTransaction[];
  pagination: PaginationMeta;
}

export type TransactionListParams = PaginationParams & {
  start?: string;
  end?: string;
};

export interface TransactionDetailParams {
  typeKey?: string;
  walletAddress?: string;
}

export const transactionsApi = {
  getSummary: () => api.get<TransactionSummary>(endpoints.transactions.summary),

  getVolume24h: () => api.get<VolumePoint24h[]>(endpoints.transactions.volume24h),

  getVolume7d: async (): Promise<VolumePoint7d[]> => {
    const res = await api.get<VolumePoint7dResponse>(endpoints.transactions.volume7d);
    return res.items ?? [];
  },

  getList: (params?: TransactionListParams) => {
    const queryParams: Record<string, string | number | boolean> =
      buildPaginatedQueryParams(params);
    if (params?.start) queryParams.start = params.start;
    if (params?.end) queryParams.end = params.end;
    return api.get<TransactionListResponse>(endpoints.transactions.list, queryParams);
  },

  getDetail: (txHash: string, params?: TransactionDetailParams) => {
    const queryParams: Record<string, string> = {};
    if (params?.typeKey) queryParams.typeKey = params.typeKey;
    if (params?.walletAddress) queryParams.walletAddress = params.walletAddress;
    return api.get<ApiTransaction>(`${endpoints.transactions.list}/${txHash}`, queryParams);
  },
};
