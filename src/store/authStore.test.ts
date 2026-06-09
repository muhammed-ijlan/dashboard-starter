import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// --- Mock cookie helpers ---

const mockReadAuthCookie = vi.fn();
const mockWriteAuthCookie = vi.fn();
const mockClearAuthCookie = vi.fn();
const mockGetJwtExp = vi.fn();

vi.mock("@/utils/auth", () => ({
  readAuthCookie: () => mockReadAuthCookie(),
  writeAuthCookie: (...args: unknown[]) => mockWriteAuthCookie(...args),
  clearAuthCookie: () => mockClearAuthCookie(),
  getJwtExp: (token: string) => mockGetJwtExp(token),
}));

// Mock window.location.replace
const mockReplace = vi.fn();
Object.defineProperty(window, "location", {
  value: { replace: mockReplace },
  writable: true,
});

// We need to re-import the store fresh for each test to reset getInitialState
async function createStore() {
  vi.resetModules();
  const mod = await import("./authStore");
  return mod.useAuthStore;
}

const mockUser = {
  id: 1,
  account: "admin",
  email: "admin@test.com",
  role: "Admin",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  mockReadAuthCookie.mockReturnValue(null);
  mockGetJwtExp.mockReturnValue(null);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("authStore - initial state", () => {
  it("starts unauthenticated when no cookie exists", async () => {
    const useAuthStore = await createStore();
    const state = useAuthStore.getState();

    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("hydrates from cookie on creation", async () => {
    mockReadAuthCookie.mockReturnValue({ token: "jwt-token", user: mockUser });
    const useAuthStore = await createStore();
    const state = useAuthStore.getState();

    expect(state.token).toBe("jwt-token");
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears expired cookie on creation", async () => {
    mockReadAuthCookie.mockReturnValue({ token: "expired-token", user: mockUser });
    mockGetJwtExp.mockReturnValue(Math.floor(Date.now() / 1000) - 100); // expired 100s ago

    const useAuthStore = await createStore();
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(mockClearAuthCookie).toHaveBeenCalled();
  });

  it("schedules auto-logout for valid token with exp", async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 60; // 60s from now
    mockReadAuthCookie.mockReturnValue({ token: "valid-token", user: mockUser });
    mockGetJwtExp.mockReturnValue(futureExp);

    const useAuthStore = await createStore();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Fast-forward past expiry
    vi.advanceTimersByTime(61_000);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});

describe("authStore - setAuth", () => {
  it("stores token and user", async () => {
    const useAuthStore = await createStore();

    useAuthStore.getState().setAuth("new-token", mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe("new-token");
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("writes cookie", async () => {
    const useAuthStore = await createStore();

    useAuthStore.getState().setAuth("new-token", mockUser);

    expect(mockWriteAuthCookie).toHaveBeenCalledWith({
      token: "new-token",
      user: mockUser,
    });
  });

  it("schedules auto-logout when token has exp", async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 30; // 30s from now
    mockGetJwtExp.mockReturnValue(futureExp);

    const useAuthStore = await createStore();
    useAuthStore.getState().setAuth("new-token", mockUser);

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Fast-forward past expiry
    vi.advanceTimersByTime(31_000);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("does not schedule logout when token has no exp", async () => {
    mockGetJwtExp.mockReturnValue(null);

    const useAuthStore = await createStore();
    useAuthStore.getState().setAuth("no-exp-token", mockUser);

    vi.advanceTimersByTime(100_000);

    // Still authenticated since no expiry scheduled
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe("authStore - clearAuth", () => {
  it("clears token, user, and authentication", async () => {
    mockReadAuthCookie.mockReturnValue({ token: "jwt-token", user: mockUser });
    const useAuthStore = await createStore();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("clears cookie", async () => {
    const useAuthStore = await createStore();
    useAuthStore.getState().setAuth("token", mockUser);
    mockClearAuthCookie.mockClear();

    useAuthStore.getState().clearAuth();

    expect(mockClearAuthCookie).toHaveBeenCalled();
  });

  it("cancels pending auto-logout timer", async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 60;
    mockGetJwtExp.mockReturnValue(futureExp);

    const useAuthStore = await createStore();
    useAuthStore.getState().setAuth("token", mockUser);

    // Clear auth before timer fires
    useAuthStore.getState().clearAuth();
    mockReplace.mockClear();

    // Fast-forward — timer should NOT fire
    vi.advanceTimersByTime(120_000);

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
