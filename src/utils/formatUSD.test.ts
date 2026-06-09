import { describe, it, expect } from "vitest";
import { formatUSD } from "./formatUSD";

describe("formatUSD", () => {
  it("returns '$0' for zero", () => {
    expect(formatUSD(0)).toBe("$0");
  });

  it("formats small amounts with dollar sign and two decimals", () => {
    expect(formatUSD(42)).toBe("$42.00");
    expect(formatUSD(850.5)).toBe("$850.50");
    expect(formatUSD(1234.56)).toBe("$1,234.56");
  });

  it("formats amounts below 100K with commas", () => {
    expect(formatUSD(58340.5)).toBe("$58,340.50");
    expect(formatUSD(99999.99)).toBe("$99,999.99");
  });

  it("formats 100K+ with K suffix", () => {
    expect(formatUSD(100000)).toBe("$100K");
    expect(formatUSD(350000)).toBe("$350K");
    expect(formatUSD(250500)).toBe("$250.5K");
  });

  it("formats millions with M suffix", () => {
    expect(formatUSD(1000000)).toBe("$1M");
    expect(formatUSD(2400000)).toBe("$2.4M");
  });

  it("formats billions with B suffix", () => {
    expect(formatUSD(1000000000)).toBe("$1B");
    expect(formatUSD(3500000000)).toBe("$3.5B");
  });

  it("formats trillions with T suffix", () => {
    expect(formatUSD(1000000000000)).toBe("$1T");
  });

  it("handles negative amounts", () => {
    expect(formatUSD(-2400000)).toBe("-$2.4M");
    expect(formatUSD(-850.5)).toBe("-$850.50");
  });

  it("strips trailing zeros from compact values", () => {
    expect(formatUSD(1000000)).toBe("$1M");
    expect(formatUSD(100000)).toBe("$100K");
  });

  it("respects custom decimals parameter", () => {
    expect(formatUSD(1234567, 1)).toBe("$1.2M");
    expect(formatUSD(1234567, 0)).toBe("$1M");
  });
});
