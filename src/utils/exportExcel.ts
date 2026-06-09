import { message } from "antd";
import i18n from "@/i18n/i18n";
import type { DownloadResult } from "@/api/client";
import { ApiError } from "@/api/types";

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
