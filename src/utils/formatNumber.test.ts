import { describe, it, expect } from "vitest";
import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("formats numbers with locale separators", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("handles small numbers", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
  });

  it("handles string numbers", () => {
    expect(formatNumber("1000")).toBe("1,000");
    expect(formatNumber("42")).toBe("42");
  });

  it("returns dash for undefined/null", () => {
    expect(formatNumber(undefined)).toBe("-");
    expect(formatNumber(null as unknown as undefined)).toBe("-");
  });

  it("returns dash for dash string", () => {
    expect(formatNumber("-")).toBe("-");
  });

  it("returns dash for NaN strings", () => {
    expect(formatNumber("abc")).toBe("-");
  });

  it("treats empty string as 0", () => {
    expect(formatNumber("")).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1000)).toBe("-1,000");
  });

  it("handles decimal numbers", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
  });
});
