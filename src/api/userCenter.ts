import type { Platform, UserDevice } from "@/types";
import { api, buildPaginatedQueryParams } from "./client";
import { endpoints } from "./endpoints";
import type { PaginationParams } from "./types";

export interface PlatformDistribution {
  android: number;
  desktop: number;
  ios: number;
  web: number;
}

export interface UserCenterSummary {
  totalUsers: number;
  newUsersToday: number;
  newUsersYesterday: number;
  newUsersTodayDelta?: number;
  newUsersTodayChangePct?: number;
  totalInstalls: number;
  activeUsers: number;
  platformDistribution: PlatformDistribution;
}

type DevicePlatform = "android" | "ios" | "web" | "desktop";

const platformMap: Record<DevicePlatform, Platform> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  desktop: "Desktop",
};

interface RawDeviceEntry {
  deviceId: string;
  platform: DevicePlatform;
  walletCount: number;
  installTime: string;
  lastActive: string;
}

interface RawDeviceList {
  data: RawDeviceEntry[];
  page: number;
  limit: number;
  total: number;
}

export interface DeviceList {
  data: UserDevice[];
  page: number;
  limit: number;
  total: number;
}

export interface DeviceListParams extends PaginationParams {
  page: number;
  limit: number;
  platform?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const userCenterApi = {
  getSummary: () => api.get<UserCenterSummary>(endpoints.userCenter.summary),

  getDevices: async (params: DeviceListParams): Promise<DeviceList> => {
    const queryParams = buildPaginatedQueryParams(params);
    if (params.platform && params.platform !== "all") {
      queryParams.platform = params.platform;
    }

    const raw = await api.get<RawDeviceList>(endpoints.userCenter.devices, queryParams);

    return {
      ...raw,
      data: raw.data.map((entry) => ({
        ...entry,
        platform: platformMap[entry.platform] ?? "Android",
      })),
    };
  },
};
