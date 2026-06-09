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

vi.mock("@/api", () => ({
  authApi: { me: () => mockMe() },
}));

const { fetchAuthPermissions, mapApiPermissions } = await import("./permissions");

beforeEach(() => {
  vi.clearAllMocks();
  mockMe.mockRejectedValue(new Error("no me"));
});

describe("fetchAuthPermissions", () => {
  it("returns full permissions when user is authenticated", async () => {
    const result = await fetchAuthPermissions();
    expect(result.permissions.length).toBeGreaterThan(0);
    expect(result.keys.length).toBeGreaterThan(0);
    expect(result.permissions[0]).toMatchObject({ view: true, edit: true, delete: true });
  });

  it("returns empty when no user is in the store", async () => {
    mockGetState.mockReturnValueOnce({
      user: null as unknown as { id: number; account: string; email: string; role: string },
    });

    const result = await fetchAuthPermissions();

    expect(result.permissions).toEqual([]);
    expect(result.keys).toEqual([]);
  });
});

describe("mapApiPermissions", () => {
  it("maps view permission correctly", () => {
    const result = mapApiPermissions([
      {
        key: "dashboard.view",
        name: "View Dashboard",
        module: "dashboard",
        description: "",
        displayOrder: 1,
        isDefault: true,
      },
    ]);
    expect(result.find((p) => p.module === "dashboard")).toEqual({
      module: "dashboard",
      view: true,
      edit: false,
      delete: false,
    });
  });

  it("maps manage to both edit and delete", () => {
    const result = mapApiPermissions([
      {
        key: "dashboard.manage",
        name: "Manage",
        module: "dashboard",
        description: "",
        displayOrder: 1,
        isDefault: false,
      },
    ]);
    const p = result.find((r) => r.module === "dashboard");
    expect(p?.edit).toBe(true);
    expect(p?.delete).toBe(true);
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
