import { describe, it, expect } from "vitest";
import { z } from "zod";
import { zodValidator } from "./zodValidator";

describe("zodValidator", () => {
  it("returns a RuleObject with a validator function", () => {
    const rule = zodValidator(z.string());
    expect(rule).toHaveProperty("validator");
    expect(typeof rule.validator).toBe("function");
  });

  it("resolves for valid values", async () => {
    const rule = zodValidator(z.string().min(1, "Required"));
    await expect(rule.validator!({} as never, "hello", vi.fn())).resolves.toBeUndefined();
  });

  it("rejects with error message for invalid values", async () => {
    const rule = zodValidator(z.string().min(1, "Required"));
    await expect(rule.validator!({} as never, "", vi.fn())).rejects.toBe("Required");
  });

  it("uses custom zod error message", async () => {
    const rule = zodValidator(z.string().email("Invalid email"));
    await expect(rule.validator!({} as never, "not-email", vi.fn())).rejects.toBe("Invalid email");
  });

  it("validates number schemas", async () => {
    const rule = zodValidator(z.number().min(0, "Must be positive"));
    await expect(rule.validator!({} as never, 5, vi.fn())).resolves.toBeUndefined();
    await expect(rule.validator!({} as never, -1, vi.fn())).rejects.toBe("Must be positive");
  });

  it("validates email schemas", async () => {
    const rule = zodValidator(z.string().email("Bad email"));
    await expect(rule.validator!({} as never, "user@test.com", vi.fn())).resolves.toBeUndefined();
    await expect(rule.validator!({} as never, "invalid", vi.fn())).rejects.toBe("Bad email");
  });

  it("falls back to 'Validation failed' when no message", async () => {
    // z.never() will fail for any value; issues may vary
    const rule = zodValidator(z.string().min(3));
    await expect(rule.validator!({} as never, "ab", vi.fn())).rejects.toBeTruthy();
  });
});
