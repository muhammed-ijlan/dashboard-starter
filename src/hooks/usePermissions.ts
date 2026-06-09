import { useMemo, useCallback } from "react";
import type { ModulePermission } from "@/types";
import { useAuthPermissionsQuery } from "./useAuthPermissionsQuery";

const EMPTY: ModulePermission[] = [];
const EMPTY_KEYS: string[] = [];

export function usePermissions() {
  const { data, isLoading, isFetching } = useAuthPermissionsQuery();
  const permissions = data?.permissions ?? EMPTY;
  const permissionKeys = data?.keys ?? EMPTY_KEYS;

  const permMap = useMemo(() => new Map(permissions.map((p) => [p.module, p])), [permissions]);

  const keySet = useMemo(() => new Set(permissionKeys), [permissionKeys]);

  const can = useCallback(
    (module: string, action: "view" | "edit" | "delete"): boolean =>
      permMap.get(module)?.[action] ?? false,
    [permMap],
  );

  const canView = useCallback((module: string) => can(module, "view"), [can]);
  const canEdit = useCallback((module: string) => can(module, "edit"), [can]);
  const canDelete = useCallback((module: string) => can(module, "delete"), [can]);

  const hasPermission = useCallback((key: string): boolean => keySet.has(key), [keySet]);

  return {
    can,
    canView,
    canEdit,
    canDelete,
    hasPermission,
    permissions,
    permissionKeys,
    isLoading,
    isFetching,
  };
}
