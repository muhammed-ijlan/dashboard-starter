import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("does not update value before delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });
    act(() => vi.advanceTimersByTime(200));

    expect(result.current).toBe("hello");
  });

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });
    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe("world");
  });

  it("resets timer on rapid value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: "d" });
    act(() => vi.advanceTimersByTime(100));

    // Only 100ms since last change — should still be "a"
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(200));
    // 300ms since last change — should now be "d"
    expect(result.current).toBe("d");
  });

  it("uses default delay of 500ms", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "start" },
    });

    rerender({ value: "end" });
    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe("start");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("end");
  });

  it("works with non-string types", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 42 },
    });

    rerender({ value: 99 });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(99);
  });
});
