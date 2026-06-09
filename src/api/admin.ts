import { api, buildPaginatedQueryParams } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PaginationMeta, PaginationParams } from "@/api/types";
import type { AdminStatus } from "@/types";

// --- Roles ---

export interface ApiRole {
  id: number;
  name: string;
  displayName: string;
  description: string;
  memberCount: number;
}

export interface ApiRolesResponse {
  list: ApiRole[];
}

// --- Admins ---

export interface AdminSummary {
  totalAdmins: number;
  activeAccounts: number;
  disabledAccounts: number;
}

export interface ApiAdmin {
  id: number;
  account: string;
  name: string;
  email: string;
  role: string;
  status: AdminStatus;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin: string;
  createdBy: string;
}

export type AdminListParams = Pick<PaginationParams, "page" | "limit" | "search">;

export interface ApiAdminListResponse {
  list: ApiAdmin[];
  pagination: PaginationMeta;
}

export interface CreateAdminPayload {
  account: string;
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateAdminPayload {
  account?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface UpdateAdminStatusPayload {
  status: AdminStatus;
}

// --- Permissions ---

export interface ApiPermission {
  key: string;
  name: string;
  nameZh?: string;
  nameEn?: string;
  module: string;
  moduleLabel?: string;
  action?: string;
  actionCanon?: string;
  actionLabel?: string;
  description: string;
  displayOrder: number;
  isDefault: boolean;
}

export interface ApiPermissionsResponse {
  permissions: ApiPermission[];
}

export interface UpdateRolePermissionsPayload {
  permissions: { module: string; permissions: string[] }[];
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: { module: string; permissions: string[] }[];
}

export interface UpdateRolePayload {
  name: string;
  description: string;
}

// --- API ---

export const adminApi = {
  // Roles
  getRoles: () => api.get<ApiRolesResponse>(endpoints.admin.roles),
  getRole: (id: number) => api.get<ApiRole>(endpoints.admin.role(id)),
  createRole: (payload: CreateRolePayload) => api.post<ApiRole>(endpoints.admin.roles, payload),
  updateRole: (id: number, payload: UpdateRolePayload) =>
    api.put<ApiRole>(endpoints.admin.role(id), payload),
  deleteRole: (id: number) => api.delete<void>(endpoints.admin.role(id)),

  // Permissions
  getPermissions: () => api.get<ApiPermissionsResponse>(endpoints.admin.permissions),
  getRolePermissions: (roleId: number) =>
    api.get<ApiPermission[]>(endpoints.admin.rolePermissions(roleId)),
  updateRolePermissions: (roleId: number, payload: UpdateRolePermissionsPayload) =>
    api.put<void>(endpoints.admin.rolePermissions(roleId), payload),

  // Admins
  getSummary: () => api.get<AdminSummary>(endpoints.admin.summary),
  getAdmins: (params?: AdminListParams) =>
    api.get<ApiAdminListResponse>(endpoints.admin.list, buildPaginatedQueryParams(params)),
  createAdmin: (payload: CreateAdminPayload) => api.post<void>(endpoints.admin.create, payload),
  updateAdmin: (id: number, payload: UpdateAdminPayload) =>
    api.put<void>(endpoints.admin.update(id), payload),
  updateAdminStatus: (id: number, payload: UpdateAdminStatusPayload) =>
    api.patch<void>(endpoints.admin.updateStatus(id), payload),
  deleteAdmin: (id: number) => api.delete<void>(endpoints.admin.delete(id)),
};
