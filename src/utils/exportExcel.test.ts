import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mock XLSX ---

const mockJsonToSheet = vi.fn(() => ({}));
const mockBookNew = vi.fn(() => ({}));
const mockBookAppendSheet = vi.fn();
const mockWriteFile = vi.fn();

vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: mockJsonToSheet,
    book_new: mockBookNew,
    book_append_sheet: mockBookAppendSheet,
  },
  writeFile: mockWriteFile,
}));

// --- Mock antd message ---

const mockHide = vi.fn();
const mockMessage = {
  loading: vi.fn(() => mockHide),
  success: vi.fn(),
  error: vi.fn(),
  config: vi.fn(),
};

vi.mock("antd", () => ({
  message: mockMessage,
}));

// --- Mock i18n ---
// Deterministic behavior regardless of whether translations have loaded:
// always return the provided defaultValue (the fallback the caller passed).
vi.mock("@/i18n/i18n", () => ({
  default: {
    t: (key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key,
  },
}));

const { exportToExcel, exportAllToExcel } = await import("./exportExcel");

const columns = [
  { header: "Name", key: "name" },
  { header: "Email", key: "email" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exportToExcel", () => {
  it("transforms data using column definitions", async () => {
    const data = [
      { name: "Alice", email: "alice@test.com", extra: "ignored" },
      { name: "Bob", email: "bob@test.com" },
    ];

    await exportToExcel(data, columns, "users");

    expect(mockJsonToSheet).toHaveBeenCalledWith([
      { Name: "Alice", Email: "alice@test.com" },
      { Name: "Bob", Email: "bob@test.com" },
    ]);
  });

  it("uses empty string for missing keys", async () => {
    const data = [{ name: "Alice" }];

    await exportToExcel(data, columns, "users");

    expect(mockJsonToSheet).toHaveBeenCalledWith([{ Name: "Alice", Email: "" }]);
  });

  it("creates workbook and writes file with correct name", async () => {
    await exportToExcel([], columns, "report");

    expect(mockBookNew).toHaveBeenCalled();
    expect(mockBookAppendSheet).toHaveBeenCalled();
    expect(mockWriteFile).toHaveBeenCalledWith(expect.anything(), "report.xlsx");
  });

  it("handles empty data array", async () => {
    await exportToExcel([], columns, "empty");

    expect(mockJsonToSheet).toHaveBeenCalledWith([]);
    expect(mockWriteFile).toHaveBeenCalled();
  });
});

describe("exportAllToExcel", () => {
  it("shows loading message, fetches data, and shows success", async () => {
    const fetchFn = vi.fn().mockResolvedValue([{ name: "Alice", email: "alice@test.com" }]);

    await exportAllToExcel(fetchFn, columns, "users");

    expect(mockMessage.loading).toHaveBeenCalledWith("Exporting...", 0);
    expect(fetchFn).toHaveBeenCalled();
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockHide).toHaveBeenCalled();
    expect(mockMessage.success).toHaveBeenCalledWith("Exported 1 rows to users.xlsx");
  });

  it("shows error message when fetch fails", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("Network error"));

    await exportAllToExcel(fetchFn, columns, "users");

    expect(mockHide).toHaveBeenCalled();
    expect(mockMessage.error).toHaveBeenCalledWith("Failed to export. Please try again.");
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it("reports correct row count in success message", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 50 }, (_, i) => ({ name: `User ${i}` })));

    await exportAllToExcel(fetchFn, columns, "bulk");

    expect(mockMessage.success).toHaveBeenCalledWith("Exported 50 rows to bulk.xlsx");
  });
});
