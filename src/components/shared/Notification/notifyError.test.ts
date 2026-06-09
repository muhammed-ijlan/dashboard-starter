import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/api/types";

const mockMessage = {
  error: vi.fn(),
  success: vi.fn(),
  config: vi.fn(),
  loading: vi.fn(),
};

vi.mock("antd", () => ({
  message: mockMessage,
}));

const { notifyError, notifySuccess, getErrorMessage } = await import("./notifyError");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getErrorMessage", () => {
  it("returns the server-provided message for ApiError regardless of status", () => {
    // Server already sends a localized message (message / messageZh), we just use it.
    expect(getErrorMessage(new ApiError(400, "Validation failed", 400))).toBe("Validation failed");
    expect(getErrorMessage(new ApiError(403, "Forbidden", 403))).toBe("Forbidden");
    expect(getErrorMessage(new ApiError(500, "Internal error", 500))).toBe("Internal error");
  });

  it("returns the server message for business-layer errors (non-zero code, HTTP 200)", () => {
    expect(getErrorMessage(new ApiError(1, "password is too common"))).toBe(
      "password is too common",
    );
    expect(getErrorMessage(new ApiError(1, "failed to load wallets"))).toBe(
      "failed to load wallets",
    );
  });

  it("falls back to a generic placeholder when the server sent no message", () => {
    expect(getErrorMessage(new ApiError(500, "", 500))).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("shows network message for fetch failures", () => {
    expect(getErrorMessage(new Error("Failed to fetch"))).toBe(
      "Unable to connect to the server. Please check your network.",
    );
  });

  it("shows error message for standard Error", () => {
    expect(getErrorMessage(new Error("Something broke"))).toBe("Something broke");
  });

  it("shows fallback message for non-Error objects", () => {
    expect(getErrorMessage("string error")).toBe("An unexpected error occurred. Please try again.");
  });

  it("shows fallback message for null", () => {
    expect(getErrorMessage(null)).toBe("An unexpected error occurred. Please try again.");
  });
});

describe("notifyError", () => {
  it("calls message.error with the error message", () => {
    notifyError(new ApiError(400, "Validation failed", 400));
    expect(mockMessage.error).toHaveBeenCalledWith("Validation failed");
  });

  it("calls message.error for network errors", () => {
    notifyError(new Error("Failed to fetch"));
    expect(mockMessage.error).toHaveBeenCalledWith(
      "Unable to connect to the server. Please check your network.",
    );
  });
});

describe("notifySuccess", () => {
  it("calls message.success with the text", () => {
    notifySuccess("Admin created successfully");
    expect(mockMessage.success).toHaveBeenCalledWith("Admin created successfully");
  });
});
