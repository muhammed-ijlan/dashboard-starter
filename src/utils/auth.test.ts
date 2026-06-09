import { describe, it, expect } from "vitest";
import { getJwtExp } from "./auth";

function makeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe("getJwtExp", () => {
  it("extracts exp from a valid JWT", () => {
    const exp = 1700000000;
    const token = makeToken({ exp, sub: "user123" });
    expect(getJwtExp(token)).toBe(exp);
  });

  it("returns null when exp is missing", () => {
    const token = makeToken({ sub: "user123" });
    expect(getJwtExp(token)).toBeNull();
  });

  it("returns null when exp is not a number", () => {
    const token = makeToken({ exp: "not-a-number" });
    expect(getJwtExp(token)).toBeNull();
  });

  it("returns null for malformed token (no dots)", () => {
    expect(getJwtExp("not-a-jwt")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getJwtExp("")).toBeNull();
  });

  it("returns null for token with empty payload segment", () => {
    expect(getJwtExp("header..signature")).toBeNull();
  });

  it("returns null for invalid base64 in payload", () => {
    expect(getJwtExp("header.!!!invalid!!!.signature")).toBeNull();
  });

  it("handles base64url characters (- and _)", () => {
    const payload = JSON.stringify({ exp: 1700000000 });
    const base64 = btoa(payload);
    const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const token = `header.${base64url}.signature`;
    expect(getJwtExp(token)).toBe(1700000000);
  });

  it("handles exp value of 0", () => {
    const token = makeToken({ exp: 0 });
    expect(getJwtExp(token)).toBe(0);
  });

  it("handles negative exp value", () => {
    const token = makeToken({ exp: -1 });
    expect(getJwtExp(token)).toBe(-1);
  });
});
