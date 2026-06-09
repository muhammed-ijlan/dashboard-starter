import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetState = vi.fn(() => ({
  user: { id: 1, account: "admin", email: "admin@test.com", role: "Admin" },
}));

vi.mock("@/store", () => ({
  useAuthStore: Object.assign(vi.fn(), {
    getState: () => mockGetState(),
  }),
}));

const mockMe = vi.fn();
const mockGetRoles = vi.fn();
const mockGetRolePermissions = vi.fn();

vi.mock("@/api", () => ({
  authApi: { me: () => mockMe() },
  adminApi: {
    getRoles: () => mockGetRoles(),
    getRolePermissions: (id: number) => mockGetRolePermissions(id),
  },
}));

const { fetchAuthPermissions, mapApiPermissions } = await import("./permissions");

beforeEach(() => {
  vi.clearAllMocks();
  mockMe.mockRejectedValue(new Error("no me"));
});

describe("fetchAuthPermissions", () => {
  it("returns mapped permissions and keys when role is found", async () => {
    mockGetRoles.mockResolvedValue({
      list: [{ id: 10, name: "admin", displayName: "Admin", description: "", memberCount: 1 }],
    });
    mockGetRolePermissions.mockResolvedValue([
      {
        key: "dashboard.view",
        name: "View Dashboard",
        module: "dashboard",
        description: "",
        displayOrder: 1,
        isDefault: true,
      },
      {
        key: "users.edit",
        name: "Edit Users",
        module: "users",
        description: "",
        displayOrder: 2,
        isDefault: false,
      },
    ]);

    const result = await fetchAuthPermissions();

    expect(result.keys).toEqual(["dashboard.view", "users.edit"]);
    expect(result.permissions.find((p) => p.module === "dashboard")).toEqual({
      module: "dashboard",
      view: true,
      edit: false,
      delete: false,
    });
    expect(result.permissions.find((p) => p.module === "userCenter")).toEqual({
      module: "userCenter",
      view: false,
      edit: true,
      delete: false,
    });
  });

  it("returns empty when no user is in the store", async () => {
    mockGetState.mockReturnValueOnce({
      user: null as unknown as {
        id: number;
        account: string;
        email: string;
        role: string;
      },
    });

    const result = await fetchAuthPermissions();

    expect(result.permissions).toEqual([]);
    expect(result.keys).toEqual([]);
    expect(mockGetRoles).not.toHaveBeenCalled();
  });

  it("returns empty when role is not found", async () => {
    mockGetRoles.mockResolvedValue({
      list: [{ id: 10, name: "other", displayName: "Other", description: "", memberCount: 1 }],
    });

    const result = await fetchAuthPermissions();

    expect(result.permissions).toEqual([]);
    expect(result.keys).toEqual([]);
  });

  it("matches role by displayName", async () => {
    mockGetRoles.mockResolvedValue({
      list: [{ id: 10, name: "admin_role", displayName: "Admin", description: "", memberCount: 1 }],
    });
    mockGetRolePermissions.mockResolvedValue([]);

    await fetchAuthPermissions();

    expect(mockGetRolePermissions).toHaveBeenCalledWith(10);
  });

  it("matches role by name as fallback", async () => {
    mockGetState.mockReturnValueOnce({
      user: { id: 1, account: "admin", email: "admin@test.com", role: "admin_role" },
    });
    mockGetRoles.mockResolvedValue({
      list: [
        {
          id: 10,
          name: "admin_role",
          displayName: "Different",
          description: "",
          memberCount: 1,
        },
      ],
    });
    mockGetRolePermissions.mockResolvedValue([]);

    await fetchAuthPermissions();

    expect(mockGetRolePermissions).toHaveBeenCalledWith(10);
  });

  it("uses the latest role from /auth/me when available", async () => {
    mockMe.mockResolvedValueOnce({
      id: 1,
      account: "admin",
      role: "SuperAdmin",
      twoFactorEnabled: false,
    });
    mockGetRoles.mockResolvedValue({
      list: [
        {
          id: 99,
          name: "super",
          displayName: "SuperAdmin",
          description: "",
          memberCount: 1,
        },
      ],
    });
    mockGetRolePermissions.mockResolvedValue([]);

    await fetchAuthPermissions();

    expect(mockGetRolePermissions).toHaveBeenCalledWith(99);
  });
});

describe("mapApiPermissions", () => {
  it("maps 'manage' to both edit and delete", () => {
    const result = mapApiPermissions([
      {
        key: "dapps.manage",
        name: "Manage DApps",
        module: "dapps",
        description: "",
        displayOrder: 1,
        isDefault: false,
      },
    ]);
    expect(result.find((p) => p.module === "dapp")).toEqual({
      module: "dapp",
      view: false,
      edit: true,
      delete: true,
    });
  });

  it("maps 'create' and 'update' to edit", () => {
    const result = mapApiPermissions([
      {
        key: "admins.create",
        name: "Create",
        module: "admins",
        description: "",
        displayOrder: 1,
        isDefault: false,
      },
      {
        key: "admins.update",
        name: "Update",
        module: "admins",
        description: "",
        displayOrder: 2,
        isDefault: false,
      },
    ]);
    const admin = result.find((p) => p.module === "admin");
    expect(admin?.edit).toBe(true);
    expect(admin?.delete).toBe(false);
  });

  it("maps 'delete' to delete only", () => {
    const result = mapApiPermissions([
      {
        key: "admins.delete",
        name: "Delete",
        module: "admins",
        description: "",
        displayOrder: 1,
        isDefault: false,
      },
    ]);
    const admin = result.find((p) => p.module === "admin");
    expect(admin?.edit).toBe(false);
    expect(admin?.delete).toBe(true);
  });

  it("groups multiple API modules into one page module", () => {
    const result = mapApiPermissions([
      {
        key: "admins.view",
        name: "View Admins",
        module: "admins",
        description: "",
        displayOrder: 1,
        isDefault: true,
      },
      {
        key: "roles.view",
        name: "View Roles",
        module: "roles",
        description: "",
        displayOrder: 2,
        isDefault: true,
      },
    ]);
    const adminPerms = result.filter((p) => p.module === "admin");
    expect(adminPerms).toHaveLength(1);
    expect(adminPerms[0]?.view).toBe(true);
  });

  it("skips unknown API modules", () => {
    const result = mapApiPermissions([
      {
        key: "unknown.view",
        name: "View Unknown",
        module: "unknown",
        description: "",
        displayOrder: 1,
        isDefault: false,
      },
    ]);
    expect(result).toEqual([]);
  });
});
