import { message } from "antd";
import i18n from "@/i18n/i18n";
import type { DownloadResult } from "@/api/client";
import { ApiError } from "@/api/types";
import { formatDate } from "./formatDate";

export type ExportColumn = { header: string; key: string; format?: "date" };

function t(key: string, fallback?: string): string {
  return i18n.t(key, { ns: "common", defaultValue: fallback ?? key });
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Stream a server-rendered export (e.g. CSV) straight to the user's disk.
 * Mirrors the loading/success/error UX of exportAllToExcel.
 */
export async function downloadServerExport(fetchFn: () => Promise<DownloadResult>): Promise<void> {
  const hide = message.loading(t("exportLoading", "Exporting..."), 0);

  try {
    const { blob, filename } = await fetchFn();
    triggerBlobDownload(blob, filename);
    hide();
    message.success(t("exportSuccess", `Exported to ${filename}`));
  } catch (error) {
    hide();
    const fallback = t("exportFailed", "Failed to export. Please try again.");
    const msg = error instanceof ApiError && error.message ? error.message : fallback;
    message.error(msg);
  }
}

function formatCell(value: unknown, format?: ExportColumn["format"]): unknown {
  if (value == null || value === "") return "";
  if (format === "date" && typeof value === "string") return formatDate(value);
  return value;
}

export async function exportToExcel(data: object[], columns: ExportColumn[], filename: string) {
  const rows = data.map((item) =>
    Object.fromEntries(
      columns.map(({ header, key, format }) => [
        t(`exportHeaders.${header}`, header),
        formatCell((item as Record<string, unknown>)[key], format),
      ]),
    ),
  );

  // Dynamic import so the ~400KB xlsx bundle is only loaded when a user
  // actually triggers an export.
  const { utils, writeFile } = await import("xlsx");
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Fetch all data from a paginated API endpoint, then export to Excel.
 * Shows a loading message while fetching.
 */
export async function exportAllToExcel(
  fetchFn: () => Promise<object[]>,
  columns: ExportColumn[],
  filename: string,
) {
  const hide = message.loading(t("exportLoading", "Exporting..."), 0);

  try {
    const data = await fetchFn();
    await exportToExcel(data, columns, filename);
    hide();
    message.success(t("exportSuccess", `Exported ${data.length} rows to ${filename}.xlsx`));
  } catch {
    hide();
    message.error(t("exportFailed", "Failed to export. Please try again."));
  }
}
