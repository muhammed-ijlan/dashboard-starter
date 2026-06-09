import { describe, it, expect } from "vitest";
import { toPageModule, apiModuleSortIndex, PAGE_MODULES, PAGE_TO_API } from "./permissions";

describe("toPageModule", () => {
  it("maps dashboard API module to dashboard page key", () => {
    expect(toPageModule("dashboard")).toBe("dashboard");
  });

  it("returns undefined for unknown modules", () => {
    expect(toPageModule("unknown")).toBeUndefined();
    expect(toPageModule("")).toBeUndefined();
    expect(toPageModule("users")).toBeUndefined();
  });
});

describe("apiModuleSortIndex", () => {
  it("returns 0 for dashboard", () => {
    expect(apiModuleSortIndex("dashboard")).toBe(0);
  });

  it("returns 999 for unknown modules", () => {
    expect(apiModuleSortIndex("unknown")).toBe(999);
    expect(apiModuleSortIndex("")).toBe(999);
  });
});

describe("PAGE_MODULES", () => {
  it("has exactly 1 module", () => {
    expect(PAGE_MODULES).toHaveLength(1);
  });

  it("contains only dashboard", () => {
    expect(PAGE_MODULES[0]?.key).toBe("dashboard");
  });
});

describe("PAGE_TO_API", () => {
  it("maps dashboard page to dashboard API module", () => {
    expect(PAGE_TO_API.dashboard).toEqual(["dashboard"]);
  });
});
