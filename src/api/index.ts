export { api } from "./client";
export { endpoints } from "./endpoints";
export { queryKeys } from "./queryKeys";

// Domain APIs
export { authApi } from "./auth";
export type { LoginPayload, LoginResult } from "./auth";
export { twoFactorApi } from "./twoFactor";
export type {
  SetupResult as TwoFactorSetupResult,
  ConfirmResult as TwoFactorConfirmResult,
  DisableResult as TwoFactorDisableResult,
} from "./twoFactor";
export type { ApiResponse, PaginationParams, PaginationMeta } from "./types";
export { ApiError } from "./types";

export { userCenterApi } from "./userCenter";
export type { UserCenterSummary, PlatformDistribution, DeviceListParams } from "./userCenter";
export { dashboardApi } from "./dashboard";

export { transactionsApi } from "./transactions";
export type {
  TransactionSummary,
  VolumePoint24h,
  VolumePoint7d,
  ApiTransaction,
  TransactionListParams,
} from "./transactions";

export { adminApi } from "./admin";
export type {
  ApiRole,
  ApiRolesResponse,
  AdminSummary,
  ApiAdmin,
  AdminListParams,
  ApiAdminListResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
  UpdateAdminStatusPayload,
  ApiPermission,
  ApiPermissionsResponse,
  UpdateRolePermissionsPayload,
  CreateRolePayload,
  UpdateRolePayload,
} from "./admin";

export { systemApi, alertsApi } from "./system";
export type {
  SystemStatus,
  ApiChain,
  ApiService,
  ApiSystemLog,
  SystemLogListParams,
  ApiAlert,
} from "./system";

export { dappsApi } from "./dapps";
export type {
  DappCategory,
  DappCategoryListParams,
  DappCategoryListResponse,
  CreateDappCategoryPayload,
  CreateDappCategoryResult,
  UpdateDappCategoryPayload,
  DappCategoryIdResult,
} from "./dapps";

export { tronGasApi } from "./tronGas";
export type {
  TronGasConfig,
  TronGasStats,
  TronGasOverview,
  NettsAccountInfo,
  FreeQuotaScope,
} from "./tronGas";
