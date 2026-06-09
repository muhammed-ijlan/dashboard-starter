import { create } from "zustand";
import type { AuthUser } from "@/types";
import { readAuthCookie, writeAuthCookie, clearAuthCookie, getJwtExp } from "@/utils/auth";

export type { AuthUser };

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

function clearLogoutTimer() {
  if (logoutTimer !== null) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

function scheduleLogout(exp: number) {
  clearLogoutTimer();
  const delay = exp * 1000 - Date.now();
  if (delay <= 0) return; // already expired — caller handles this
  logoutTimer = setTimeout(() => {
    useAuthStore.getState().clearAuth();
    window.location.replace("/login");
  }, delay);
}

function getInitialState(): Pick<AuthState, "token" | "user" | "isAuthenticated"> {
  const cookie = readAuthCookie();
  if (!cookie) return { token: null, user: null, isAuthenticated: false };

  const exp = getJwtExp(cookie.token);
  if (exp !== null && exp * 1000 <= Date.now()) {
    // Token is already expired — purge the stale cookie
    clearAuthCookie();
    return { token: null, user: null, isAuthenticated: false };
  }

  // Valid token — schedule the auto-logout timer
  if (exp !== null) scheduleLogout(exp);

  return { token: cookie.token, user: cookie.user, isAuthenticated: true };
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...getInitialState(),

  setAuth: (token, user) => {
    writeAuthCookie({ token, user });
    const exp = getJwtExp(token);
    if (exp !== null) scheduleLogout(exp);
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    clearAuthCookie();
    clearLogoutTimer();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
