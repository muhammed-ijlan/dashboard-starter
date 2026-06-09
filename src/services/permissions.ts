import { authApi } from "@/api";
import { useAuthStore } from "@/store";
import type { ModulePermission } from "@/types";
import { PAGE_MODULES, toPageModule } from "@/constants/permissions";

export interface AuthPermissions {
  permissions: ModulePermission[];
  keys: string[];
}

export const EMPTY_AUTH_PERMISSIONS: AuthPermissions = {
  permissions: [],
  keys: [],
};

export interface ApiPermissionShape {
  key: string;
  name: string;
  module: string;
  description: string;
  displayOrder: number;
  isDefault: boolean;
}

export function mapApiPermissions(apiPerms: ApiPermissionShape[]): ModulePermission[] {
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

/** Returns full permissions for all configured modules. Replace with your own API call. */
function fullPermissions(): AuthPermissions {
  const permissions: ModulePermission[] = PAGE_MODULES.map((m) => ({
    module: m.key,
    view: true,
    edit: true,
    delete: true,
  }));
  const keys = permissions.map((p) => `${p.module}.view`);
  return { permissions, keys };
}

export async function fetchAuthPermissions(): Promise<AuthPermissions> {
  const user = useAuthStore.getState().user;
  if (!user) return EMPTY_AUTH_PERMISSIONS;

  try {
    await authApi.me();
  } catch {
    // proceed with cached user
  }

  // TODO: replace with your own permission fetching logic
  return fullPermissions();
}
