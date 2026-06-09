import { describe, it, expect } from "vitest";
import { formatAmount } from "./formatAmount";

describe("formatAmount", () => {
  it("formats whole numbers without trailing zeros", () => {
    expect(formatAmount(1)).toBe("1");
    expect(formatAmount(100)).toBe("100");
  });

  it("preserves significant decimal places", () => {
    expect(formatAmount(0.5)).toBe("0.5");
    expect(formatAmount(1.23456789)).toBe("1.23456789");
    expect(formatAmount(0.00000001)).toBe("0.00000001");
  });

  it("strips trailing zeros after decimal", () => {
    expect(formatAmount(1.5)).toBe("1.5");
    expect(formatAmount(1.1)).toBe("1.1");
    expect(formatAmount(0.001)).toBe("0.001");
  });

  it("handles zero", () => {
    expect(formatAmount(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatAmount(-0.5)).toBe("-0.5");
    expect(formatAmount(-100)).toBe("-100");
  });

  it("truncates beyond 8 decimal places", () => {
    expect(formatAmount(0.123456789)).toBe("0.12345679");
  });
});
