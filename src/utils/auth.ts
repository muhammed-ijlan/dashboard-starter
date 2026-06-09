import Cookies from "js-cookie";
import type { AuthUser } from "@/types";

const COOKIE_NAME = "auth";

export interface AuthCookieData {
  token: string;
  user: AuthUser;
}

export function getJwtExp(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    // Base64url → Base64
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    const payload = JSON.parse(json) as Record<string, unknown>;
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function isAuthCookieData(value: unknown): value is AuthCookieData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  if (typeof data.token !== "string") return false;
  const user = data.user;
  if (typeof user !== "object" || user === null) return false;
  const u = user as Record<string, unknown>;
  return (
    typeof u.id === "number" &&
    typeof u.account === "string" &&
    typeof u.email === "string" &&
    typeof u.role === "string"
  );
}

export function readAuthCookie(): AuthCookieData | null {
  try {
    const raw = Cookies.get(COOKIE_NAME);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isAuthCookieData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

const isSecure = window.location.protocol === "https:";

const COOKIE_OPTIONS = {
  path: "/",
  secure: isSecure,
  sameSite: "Lax" as const,
};

export function writeAuthCookie(data: AuthCookieData): void {
  const exp = getJwtExp(data.token);
  const expires = exp ? new Date(exp * 1000) : undefined;
  Cookies.set(COOKIE_NAME, JSON.stringify(data), {
    ...COOKIE_OPTIONS,
    expires,
  });
}

export function clearAuthCookie(): void {
  Cookies.remove(COOKIE_NAME, COOKIE_OPTIONS);
}
