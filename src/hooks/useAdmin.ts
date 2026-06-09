import { adminApi, queryKeys } from "@/api";
import type {
  AdminListParams,
  CreateAdminPayload,
  CreateRolePayload,
  UpdateAdminPayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminEntry, AdminStatus } from "@/types";
import type { ApiRole, ApiAdmin } from "@/api/admin";

// --- Mappers ---

function mapRole(apiRole: ApiRole) {
  return {
    id: String(apiRole.id),
    name: apiRole.name,
    displayName: apiRole.displayName,
    description: apiRole.description,
    memberCount: apiRole.memberCount,
  };
}

export function mapAdmin(a: ApiAdmin): AdminEntry {
  return {
    id: String(a.id),
    account: a.account,
    name: a.name,
    email: a.email,
    role: a.role,
    state: a.status === "active" ? "Normal" : "Disabled",
    google2FA: a.twoFactorEnabled ? "Bound" : "Unbound",
    createdAt: a.createdAt,
    lastLogin: a.lastLogin,
    createdBy: a.createdBy,
  };
}

// --- Hook ---

interface UseAdminOptions {
  listParams?: AdminListParams;
  roleId?: number;
  rolesEnabled?: boolean;
  adminsEnabled?: boolean;
  summaryEnabled?: boolean;
  permissionsEnabled?: boolean;
}

export const useAdmin = (options: UseAdminOptions = {}) => {
  const {
    listParams,
    roleId = 0,
    rolesEnabled = true,
    adminsEnabled = true,
    summaryEnabled = true,
    permissionsEnabled = false,
  } = options;

  const queryClient = useQueryClient();

  // --- Queries ---

  const rolesQuery = useQuery({
    queryKey: queryKeys.admin.roles(),
    queryFn: adminApi.getRoles,
    select: (data) => data.list.map(mapRole),
    enabled: rolesEnabled,
  });

  const roleQuery = useQuery({
    queryKey: queryKeys.admin.role(roleId),
    queryFn: () => adminApi.getRole(roleId),
    select: mapRole,
    enabled: roleId > 0,
  });

  const summaryQuery = useQuery({
    queryKey: queryKeys.admin.summary(),
    queryFn: adminApi.getSummary,
    enabled: summaryEnabled,
  });

  const adminsQuery = useQuery({
    queryKey: queryKeys.admin.list(listParams),
    queryFn: () => adminApi.getAdmins(listParams),
    select: (data) => ({
      admins: data.list.map(mapAdmin),
      total: data.pagination.total,
    }),
    placeholderData: (prev) => prev,
    enabled: adminsEnabled && !!listParams,
  });

  const permissionsQuery = useQuery({
    queryKey: queryKeys.admin.permissions(),
    queryFn: adminApi.getPermissions,
    select: (data) => data.permissions,
    enabled: permissionsEnabled,
  });

  const rolePermissionsQuery = useQuery({
    queryKey: queryKeys.admin.rolePermissions(roleId),
    queryFn: () => adminApi.getRolePermissions(roleId),
    enabled: roleId > 0,
  });

  // --- Mutations ---

  const invalidateAdminLists = () => {
    void queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, "list"] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary() });
  };

  const createAdminMutation = useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminApi.createAdmin(payload),
    onSuccess: invalidateAdminLists,
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAdminPayload }) =>
      adminApi.updateAdmin(id, payload),
    onSuccess: invalidateAdminLists,
  });

  const toggleAdminStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AdminStatus }) =>
      adminApi.updateAdminStatus(id, { status }),
    onSuccess: invalidateAdminLists,
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteAdmin(id),
    onSuccess: invalidateAdminLists,
  });

  const createRoleMutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => adminApi.createRole(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles() });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteRole(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles() });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRolePayload }) =>
      adminApi.updateRole(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles() });
    },
  });

  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({ roleId, payload }: { roleId: number; payload: UpdateRolePermissionsPayload }) =>
      adminApi.updateRolePermissions(roleId, payload),
    onSuccess: (_data, { roleId }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.rolePermissions(roleId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.roles(),
      });
    },
  });

  return {
    roles: rolesQuery.data,
    role: roleQuery.data,
    adminSummary: summaryQuery.data,
    admins: adminsQuery.data?.admins,
    adminsTotal: adminsQuery.data?.total,
    permissions: permissionsQuery.data,
    rolePermissions: rolePermissionsQuery.data,

    rolesLoading: rolesQuery.isLoading,
    adminsLoading: adminsQuery.isLoading,
    summaryLoading: summaryQuery.isLoading,

    createAdmin: createAdminMutation,
    updateAdmin: updateAdminMutation,
    deleteAdmin: deleteAdminMutation,
    toggleAdminStatus: toggleAdminStatusMutation,
    createRole: createRoleMutation,
    updateRole: updateRoleMutation,
    deleteRole: deleteRoleMutation,
    updateRolePermissions: updateRolePermissionsMutation,
  };
};
