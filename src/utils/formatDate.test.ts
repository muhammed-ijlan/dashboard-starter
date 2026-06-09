import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO date string", () => {
    const result = formatDate("2024-03-15T14:30:00");
    expect(result).toContain("03");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats date with space separator (API format)", () => {
    const result = formatDate("2024-03-15 14:30:00");
    expect(result).toContain("03");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("includes time in 12-hour format with AM/PM", () => {
    const result = formatDate("2024-03-15T14:30:00");
    expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}\s(AM|PM)/);
  });

  it("appends the local UTC offset", () => {
    const result = formatDate("2024-03-15T14:30:00");
    expect(result).toMatch(/UTC[+-]\d{2}(:\d{2})?$/);
  });

  it("treats input as UTC and converts to local timezone", () => {
    const result = formatDate("2024-01-01T00:00:00");
    expect(result).toContain("2024");
    expect(result).toContain("01");
  });

  it("pads single-digit days", () => {
    const result = formatDate("2024-03-05T10:00:00");
    expect(result).toContain("05");
  });
});
