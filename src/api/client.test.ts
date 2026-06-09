import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "./types";

const mockClearAuth = vi.fn();
const mockGetState = vi.fn(() => ({
  token: "test-token",
  clearAuth: mockClearAuth,
}));

vi.mock("@/store", () => ({
  useAuthStore: Object.assign(vi.fn(), {
    getState: () => mockGetState(),
  }),
}));

const mockReplace = vi.fn();
Object.defineProperty(window, "location", {
  value: { replace: mockReplace, protocol: "https:" },
  writable: true,
});

vi.stubEnv("VITE_API_BASE_URL", "https://api.test.com");

const { api, __resetUnauthorizedGuardForTest } = await import("./client");

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = vi.fn();
  __resetUnauthorizedGuardForTest();
});

function mockFetch(response: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
}) {
  (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    statusText: response.statusText ?? "OK",
    json: response.json ?? (() => Promise.resolve({ code: 0, message: "ok", data: {} })),
  });
}

describe("api.get", () => {
  it("makes GET request to correct URL", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: { id: 1 } }),
    });

    const result = await api.get<{ id: number }>("/users");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.test.com/users",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual({ id: 1 });
  });

  it("appends query params", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: [] }),
    });

    await api.get("/users", { page: 1, limit: 10 });

    const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
    expect(url).toContain("page=1");
    expect(url).toContain("limit=10");
  });

  it("includes Authorization header when token exists", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: {} }),
    });

    await api.get("/test");

    const headers = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]?.headers;
    expect(headers).toMatchObject({ Authorization: "Bearer test-token" });
  });

  it("omits Authorization header when no token", async () => {
    mockGetState.mockReturnValueOnce({
      token: null as unknown as string,
      clearAuth: mockClearAuth,
    });
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: {} }),
    });

    await api.get("/test");

    const headers = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[1]?.headers;
    expect(headers).not.toHaveProperty("Authorization");
  });
});

describe("api.post", () => {
  it("sends JSON body", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: {} }),
    });

    await api.post("/users", { name: "test" });

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[1]?.method).toBe("POST");
    expect(call?.[1]?.body).toBe(JSON.stringify({ name: "test" }));
  });
});

describe("api.put", () => {
  it("sends PUT request", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: {} }),
    });

    await api.put("/users/1", { name: "updated" });

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[1]?.method).toBe("PUT");
  });
});

describe("api.delete", () => {
  it("sends DELETE request", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 0, message: "ok", data: {} }),
    });

    await api.delete("/users/1");

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[1]?.method).toBe("DELETE");
  });
});

describe("error handling", () => {
  it("throws ApiError for non-ok response", async () => {
    mockFetch({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: () => Promise.resolve({ message: "Validation failed" }),
    });

    await expect(api.get("/test")).rejects.toThrow(ApiError);
    await expect(api.get("/test")).rejects.toThrow("Validation failed");
  });

  it("throws ApiError with statusCode for HTTP errors", async () => {
    mockFetch({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({ message: "Server broke" }),
    });

    try {
      await api.get("/test");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).statusCode).toBe(500);
    }
  });

  it("throws ApiError when response code is non-zero", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 1001, message: "Business error", data: null }),
    });

    await expect(api.get("/test")).rejects.toThrow("Business error");
  });

  it("handles 401 by clearing auth and redirecting", async () => {
    mockFetch({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ code: 401, message: "Token expired" }),
    });

    await expect(api.get("/test")).rejects.toThrow(ApiError);
    expect(mockClearAuth).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("handles 401 in response body code", async () => {
    mockFetch({
      json: () => Promise.resolve({ code: 401, message: "Session expired", data: null }),
    });

    await expect(api.get("/test")).rejects.toThrow("Session expired");
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it("does not clear auth if token changed between request and response", async () => {
    let callCount = 0;
    mockGetState.mockImplementation(() => {
      callCount++;
      return {
        token: callCount === 1 ? "test-token" : "different-token",
        clearAuth: mockClearAuth,
      };
    });

    mockFetch({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ code: 401, message: "Token expired" }),
    });

    await expect(api.get("/test")).rejects.toThrow(ApiError);
    expect(mockClearAuth).not.toHaveBeenCalled();
  });

  it("handles non-JSON error bodies gracefully", async () => {
    mockFetch({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("not json")),
    });

    await expect(api.get("/test")).rejects.toThrow(ApiError);
  });
});
