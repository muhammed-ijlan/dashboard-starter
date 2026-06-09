import { api, buildPaginatedQueryParams } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PaginationMeta, PaginationParams } from "@/api/types";

export interface SystemStatus {
  chainNodesOnline: number;
  cpuUsage: number;
  memoryUsage: number;
  servicesRunning: number;
  systemHealth: string;
  unresolvedAlarms: number;
}

export interface ApiChain {
  chain: string;
  status: string;
  blockHeight: number;
  latestBlockTime: string;
  peers: number;
  hashrate: string;
  syncProgress: string;
}

export interface ApiChainsResponse {
  chains: ApiChain[];
}

export interface ApiService {
  id: number;
  name: string;
  nameZh?: string;
  status: string;
  uptime: string;
  responseTime: string;
  requestVolume: string;
}

export interface ApiServicesResponse {
  list: ApiService[];
}

export interface ApiSystemLog {
  id: number;
  level: string;
  message: string;
  messageZh?: string;
  source: string;
  createdAt: string;
}

export type SystemLogListParams = Pick<PaginationParams, "page" | "limit">;

export interface ApiSystemLogsResponse {
  list: ApiSystemLog[];
  pagination: PaginationMeta;
}

export interface ApiAlert {
  id: number;
  message: string;
  messageZh?: string;
  messageLabel?: string;
  severity: string;
  severityLabel?: string;
  resolved: boolean;
  resolvedLabel?: string;
  createdAt: string;
}

export interface ApiAlertsResponse {
  list: ApiAlert[];
  pagination: PaginationMeta;
}

export const alertsApi = {
  getAlerts: () => api.get<ApiAlertsResponse>(endpoints.alerts.list),
  resolveAlert: (id: string) => api.post<void>(endpoints.alerts.resolve(id)),
};

export const systemApi = {
  getStatus: () => api.get<SystemStatus>(endpoints.system.status),
  getChains: () => api.get<ApiChainsResponse>(endpoints.system.chains),
  getServices: () => api.get<ApiServicesResponse>(endpoints.system.services),
  getLogs: (params?: SystemLogListParams) =>
    api.get<ApiSystemLogsResponse>(endpoints.system.logs, buildPaginatedQueryParams(params)),
};
