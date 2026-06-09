import { describe, it, expect } from "vitest";
import { formatCompact } from "./formatCompact";

describe("formatCompact", () => {
  it("returns '0' for zero", () => {
    expect(formatCompact(0)).toBe("0");
  });

  it("formats numbers below 100K with commas", () => {
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(1000)).toBe("1,000");
    expect(formatCompact(12458)).toBe("12,458");
    expect(formatCompact(99999)).toBe("99,999");
  });

  it("formats 100K+ with K suffix", () => {
    expect(formatCompact(100000)).toBe("100K");
    expect(formatCompact(350000)).toBe("350K");
    expect(formatCompact(999999)).toBe("1000K");
  });

  it("formats millions with M suffix", () => {
    expect(formatCompact(1000000)).toBe("1M");
    expect(formatCompact(1200000)).toBe("1.2M");
    expect(formatCompact(999000000)).toBe("999M");
  });

  it("formats billions with B suffix", () => {
    expect(formatCompact(1000000000)).toBe("1B");
    expect(formatCompact(2500000000)).toBe("2.5B");
  });

  it("formats trillions with T suffix", () => {
    expect(formatCompact(1000000000000)).toBe("1T");
    expect(formatCompact(1500000000000)).toBe("1.5T");
  });

  it("strips trailing .0 from compact values", () => {
    expect(formatCompact(1000000)).toBe("1M");
    expect(formatCompact(100000)).toBe("100K");
  });

  it("handles negative numbers", () => {
    expect(formatCompact(-1200000)).toBe("-1.2M");
    expect(formatCompact(-350000)).toBe("-350K");
    expect(formatCompact(-500)).toBe("-500");
  });

  it("respects custom decimals parameter", () => {
    expect(formatCompact(1234567, 2)).toBe("1.23M");
    expect(formatCompact(1234567, 0)).toBe("1M");
  });
});
