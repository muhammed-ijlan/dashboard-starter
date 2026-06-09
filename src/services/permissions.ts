import { authApi, adminApi } from "@/api";
import type { ApiPermission } from "@/api/admin";
import { useAuthStore } from "@/store";
import type { ModulePermission } from "@/types";
import { toPageModule } from "@/constants/permissions";

export interface AuthPermissions {
  permissions: ModulePermission[];
  keys: string[];
}

export const EMPTY_AUTH_PERMISSIONS: AuthPermissions = {
  permissions: [],
  keys: [],
};

export function mapApiPermissions(apiPerms: ApiPermission[]): ModulePermission[] {
  const map = new Map<string, ModulePermission>();

  for (const p of apiPerms) {
    const pageKey = toPageModule(p.module);
    if (!pageKey) continue;

    if (!map.has(pageKey)) {
      map.set(pageKey, { module: pageKey, view: false, edit: false, delete: false });
    }
    const entry = map.get(pageKey)!;
    const action = p.key.split(".").pop();

    if (action === "view") entry.view = true;
    else if (action === "manage" || action === "create" || action === "update" || action === "edit")
      entry.edit = true;
    if (action === "manage" || action === "delete") entry.delete = true;
  }

  return [...map.values()];
}

export async function fetchAuthPermissions(): Promise<AuthPermissions> {
  const user = useAuthStore.getState().user;
  if (!user) return EMPTY_AUTH_PERMISSIONS;

  let currentRole = user.role;
  try {
    const me = await authApi.me();
    if (me?.role) currentRole = me.role;
  } catch {
    // fall back to cached role on the store
  }

  const rolesRes = await adminApi.getRoles();
  const role = rolesRes.list.find((r) => r.displayName === currentRole || r.name === currentRole);
  if (!role) return EMPTY_AUTH_PERMISSIONS;

  const apiPerms = await adminApi.getRolePermissions(role.id);
  return {
    permissions: mapApiPermissions(apiPerms),
    keys: apiPerms.map((p) => p.key),
  };
}
