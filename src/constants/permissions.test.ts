import { describe, it, expect } from "vitest";
import { toPageModule, apiModuleSortIndex, PAGE_MODULES, PAGE_TO_API } from "./permissions";

describe("toPageModule", () => {
  it("maps standard API modules to page keys", () => {
    expect(toPageModule("dashboard")).toBe("dashboard");
    expect(toPageModule("users")).toBe("userCenter");
    expect(toPageModule("wallets")).toBe("wallet");
    expect(toPageModule("transactions")).toBe("transaction");
    expect(toPageModule("dapps")).toBe("dapp");
    expect(toPageModule("system")).toBe("system");
  });

  it("maps admin-related modules to admin page", () => {
    expect(toPageModule("admins")).toBe("admin");
    expect(toPageModule("roles")).toBe("admin");
    expect(toPageModule("permissions")).toBe("admin");
  });

  it("maps alerts to system page", () => {
    expect(toPageModule("alerts")).toBe("system");
  });

  it("returns undefined for unknown modules", () => {
    expect(toPageModule("unknown")).toBeUndefined();
    expect(toPageModule("")).toBeUndefined();
    expect(toPageModule("devices")).toBeUndefined();
  });
});

describe("apiModuleSortIndex", () => {
  it("returns correct index matching PAGE_MODULES order", () => {
    expect(apiModuleSortIndex("dashboard")).toBe(0);
    expect(apiModuleSortIndex("users")).toBe(1);
    expect(apiModuleSortIndex("wallets")).toBe(2);
    expect(apiModuleSortIndex("transactions")).toBe(3);
    expect(apiModuleSortIndex("dapps")).toBe(4);
    expect(apiModuleSortIndex("trongas")).toBe(5);
    expect(apiModuleSortIndex("admins")).toBe(6);
    expect(apiModuleSortIndex("system")).toBe(7);
  });

  it("gives same index to modules that map to the same page", () => {
    expect(apiModuleSortIndex("admins")).toBe(apiModuleSortIndex("roles"));
    expect(apiModuleSortIndex("admins")).toBe(apiModuleSortIndex("permissions"));

    expect(apiModuleSortIndex("system")).toBe(apiModuleSortIndex("alerts"));
  });

  it("returns 999 for unknown modules", () => {
    expect(apiModuleSortIndex("unknown")).toBe(999);
    expect(apiModuleSortIndex("")).toBe(999);
  });

  it("sorts modules in the expected display order", () => {
    const apiModules = [
      "system",
      "dapps",
      "dashboard",
      "users",
      "admins",
      "wallets",
      "trongas",
      "transactions",
    ];
    const sorted = [...apiModules].sort((a, b) => apiModuleSortIndex(a) - apiModuleSortIndex(b));
    expect(sorted).toEqual([
      "dashboard",
      "users",
      "wallets",
      "transactions",
      "dapps",
      "trongas",
      "admins",
      "system",
    ]);
  });
});

describe("PAGE_MODULES", () => {
  it("has exactly 8 modules", () => {
    expect(PAGE_MODULES).toHaveLength(8);
  });

  it("maintains the correct display order", () => {
    const keys = PAGE_MODULES.map((m) => m.key);
    expect(keys).toEqual([
      "dashboard",
      "userCenter",
      "wallet",
      "transaction",
      "dapp",
      "tronGas",
      "admin",
      "system",
    ]);
  });
});

describe("PAGE_TO_API", () => {
  it("maps each page module to at least one API module", () => {
    for (const mod of PAGE_MODULES) {
      expect(PAGE_TO_API[mod.key].length).toBeGreaterThan(0);
    }
  });

  it("admin page maps to admins, roles, and permissions", () => {
    expect(PAGE_TO_API.admin).toEqual(["admins", "roles", "permissions"]);
  });

  it("system page maps to system and alerts", () => {
    expect(PAGE_TO_API.system).toEqual(["system", "alerts"]);
  });
});
