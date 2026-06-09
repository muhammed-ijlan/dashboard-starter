import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSetAuth = vi.fn();
const mockClearAuth = vi.fn();
const mockGetState = vi.fn(() => ({
  token: "mock-token",
  user: { id: 1, account: "admin", email: "admin@test.com", role: "Admin" },
  setAuth: mockSetAuth,
  clearAuth: mockClearAuth,
  isAuthenticated: true,
}));

vi.mock("@/store", () => ({
  useAuthStore: Object.assign(vi.fn(), {
    getState: () => mockGetState(),
  }),
}));

const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock("@/api", () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
    logout: () => mockLogout(),
  },
}));

const { authService } = await import("./authService");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authService.login", () => {
  const loginResponse = {
    token: "jwt-token",
    user: { id: 1, account: "admin", email: "admin@test.com", role: "Admin" },
  };

  it("returns token and identity-only user", async () => {
    mockLogin.mockResolvedValue(loginResponse);

    const result = await authService.login("admin", "password");

    expect(result.token).toBe("jwt-token");
    expect(result.user).toEqual({
      id: 1,
      account: "admin",
      email: "admin@test.com",
      role: "Admin",
    });
  });

  it("writes identity to the auth store", async () => {
    mockLogin.mockResolvedValue(loginResponse);

    await authService.login("admin", "password");

    expect(mockSetAuth).toHaveBeenCalledWith("jwt-token", {
      id: 1,
      account: "admin",
      email: "admin@test.com",
      role: "Admin",
    });
  });
});

describe("authService.logout", () => {
  it("calls the logout API and clears local auth", async () => {
    mockLogout.mockResolvedValue({ message: "ok" });

    await authService.logout();

    expect(mockLogout).toHaveBeenCalled();
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it("clears local auth even when the logout API fails", async () => {
    mockLogout.mockRejectedValue(new Error("network"));

    await authService.logout();

    expect(mockClearAuth).toHaveBeenCalled();
  });
});
