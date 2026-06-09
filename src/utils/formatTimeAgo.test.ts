import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatTimeAgo } from "./formatTimeAgo";

describe("formatTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns dash for empty or dash input", () => {
    expect(formatTimeAgo("")).toBe("-");
    expect(formatTimeAgo("-")).toBe("-");
  });

  it("returns original string for invalid dates", () => {
    expect(formatTimeAgo("not-a-date")).toBe("not-a-date");
  });

  it("formats seconds ago", () => {
    const result = formatTimeAgo("2024-06-15T11:59:30Z");
    expect(result).toMatch(/30 seconds ago|30 秒前/);
  });

  it("formats minutes ago", () => {
    const result = formatTimeAgo("2024-06-15T11:55:00Z");
    expect(result).toMatch(/5 minutes ago|5 分钟前/);
  });

  it("formats hours ago", () => {
    const result = formatTimeAgo("2024-06-15T09:00:00Z");
    expect(result).toMatch(/3 hours ago|3 小时前/);
  });

  it("formats days ago", () => {
    const result = formatTimeAgo("2024-06-12T12:00:00Z");
    expect(result).toMatch(/3 days ago|3 天前/);
  });

  it("formats months ago", () => {
    const result = formatTimeAgo("2024-03-15T12:00:00Z");
    expect(result).toMatch(/3 months ago|3 个月前/);
  });

  it("falls back to locale date for 12+ months", () => {
    const result = formatTimeAgo("2023-01-15T12:00:00Z");
    expect(result).not.toMatch(/ago/);
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles API date format with space separator", () => {
    const result = formatTimeAgo("2024-06-15 11:55:00");
    expect(result).not.toBe("2024-06-15 11:55:00");
    expect(result).not.toBe("-");
  });

  it("handles 'just now' (0 seconds)", () => {
    const result = formatTimeAgo("2024-06-15T12:00:00Z");
    expect(result).toBeTruthy();
  });
});
