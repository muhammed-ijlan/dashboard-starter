import { describe, it, expect } from "vitest";
import { getPageNumbers } from "./getPageNumbers";

describe("getPageNumbers", () => {
  it("returns all pages when totalPages <= 7", () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("returns empty for 0 pages", () => {
    expect(getPageNumbers(1, 0)).toEqual([]);
  });

  it("shows ellipsis at the end when on first page with many pages", () => {
    const pages = getPageNumbers(1, 10);
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe(2);
    expect(pages).toContain("...");
    expect(pages[pages.length - 1]).toBe(10);
  });

  it("shows ellipsis at the start when on last page", () => {
    const pages = getPageNumbers(10, 10);
    expect(pages[0]).toBe(1);
    expect(pages).toContain("...");
    expect(pages[pages.length - 2]).toBe(9);
    expect(pages[pages.length - 1]).toBe(10);
  });

  it("shows ellipsis on both sides when in the middle", () => {
    const pages = getPageNumbers(5, 10);
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe("...");
    expect(pages).toContain(4);
    expect(pages).toContain(5);
    expect(pages).toContain(6);
    expect(pages[pages.length - 2]).toBe("...");
    expect(pages[pages.length - 1]).toBe(10);
  });

  it("always includes first and last page", () => {
    for (let current = 1; current <= 20; current++) {
      const pages = getPageNumbers(current, 20);
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(20);
    }
  });

  it("always includes current page and its neighbors", () => {
    const pages = getPageNumbers(8, 15);
    expect(pages).toContain(7);
    expect(pages).toContain(8);
    expect(pages).toContain(9);
  });

  it("does not show ellipsis adjacent to first/last page", () => {
    // On page 2 — left neighbor is 1, so no start ellipsis needed
    const pages = getPageNumbers(2, 10);
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe(2);
    expect(pages[2]).toBe(3);
    // No ellipsis between 1 and 2
    expect(pages.indexOf("...")).toBeGreaterThan(2);
  });

  it("handles page 3 (edge case near start)", () => {
    const pages = getPageNumbers(3, 10);
    expect(pages[0]).toBe(1);
    expect(pages).toContain(2);
    expect(pages).toContain(3);
    expect(pages).toContain(4);
    expect(pages[pages.length - 1]).toBe(10);
  });

  it("handles second-to-last page (edge case near end)", () => {
    const pages = getPageNumbers(9, 10);
    expect(pages).toContain(8);
    expect(pages).toContain(9);
    expect(pages).toContain(10);
    expect(pages[0]).toBe(1);
  });
});
