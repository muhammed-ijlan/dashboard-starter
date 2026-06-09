import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ModulePermission } from "@/types";
import { PermissionKey } from "@/constants/permissionKeys";

let mockPermissions: ModulePermission[] = [];
let mockPermissionKeys: string[] = [];

vi.mock("./useAuthPermissionsQuery", () => ({
  useAuthPermissionsQuery: () => ({
    data: { permissions: mockPermissions, keys: mockPermissionKeys },
    isLoading: false,
    isFetching: false,
  }),
}));

const { usePermissions } = await import("./usePermissions");

beforeEach(() => {
  mockPermissions = [];
  mockPermissionKeys = [];
});

describe("usePermissions", () => {
  describe("can / canView / canEdit / canDelete", () => {
    it("returns false when no permissions exist", () => {
      const { result } = renderHook(() => usePermissions());

      expect(result.current.canView("dashboard")).toBe(false);
      expect(result.current.canEdit("dashboard")).toBe(false);
      expect(result.current.canDelete("dashboard")).toBe(false);
      expect(result.current.can("dashboard", "view")).toBe(false);
    });

    it("returns true for granted permissions", () => {
      mockPermissions = [
        { module: "dashboard", view: true, edit: false, delete: false },
        { module: "admin", view: true, edit: true, delete: true },
      ];

      const { result } = renderHook(() => usePermissions());

      expect(result.current.canView("dashboard")).toBe(true);
      expect(result.current.canEdit("dashboard")).toBe(false);
      expect(result.current.canDelete("dashboard")).toBe(false);

      expect(result.current.canView("admin")).toBe(true);
      expect(result.current.canEdit("admin")).toBe(true);
      expect(result.current.canDelete("admin")).toBe(true);
    });

    it("returns false for unknown modules", () => {
      mockPermissions = [{ module: "dashboard", view: true, edit: false, delete: false }];

      const { result } = renderHook(() => usePermissions());

      expect(result.current.canView("unknown")).toBe(false);
    });
  });

  describe("hasPermission", () => {
    it("returns false when no keys exist", () => {
      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PermissionKey.AdminsCreate)).toBe(false);
    });

    it("returns true for granted API keys", () => {
      mockPermissionKeys = [
        PermissionKey.DashboardView,
        PermissionKey.AdminsCreate,
        PermissionKey.AdminsUpdate,
        PermissionKey.DappsCreate,
      ];

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PermissionKey.DashboardView)).toBe(true);
      expect(result.current.hasPermission(PermissionKey.AdminsCreate)).toBe(true);
      expect(result.current.hasPermission(PermissionKey.DappsCreate)).toBe(true);
    });

    it("returns false for non-granted API keys", () => {
      mockPermissionKeys = [PermissionKey.DashboardView];

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasPermission(PermissionKey.AdminsDelete)).toBe(false);
      expect(result.current.hasPermission("")).toBe(false);
    });
  });

  describe("permissions array", () => {
    it("returns empty array when no permissions", () => {
      const { result } = renderHook(() => usePermissions());

      expect(result.current.permissions).toEqual([]);
    });

    it("returns the permissions from the query", () => {
      mockPermissions = [
        { module: "dashboard", view: true, edit: false, delete: false },
        { module: "admin", view: true, edit: true, delete: true },
      ];

      const { result } = renderHook(() => usePermissions());

      expect(result.current.permissions).toHaveLength(2);
      expect(result.current.permissions[0]?.module).toBe("dashboard");
      expect(result.current.permissions[1]?.module).toBe("admin");
    });
  });
});
