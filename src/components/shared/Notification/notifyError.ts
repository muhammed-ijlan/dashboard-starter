import { message } from "antd";
import { ApiError } from "@/api/types";
import i18n from "@/i18n/i18n";

message.config({
  maxCount: 3,
  duration: 3,
  top: 16,
});

function tt(key: string, fallback: string): string {
  return i18n.t(key, { ns: "common", defaultValue: fallback });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Server provides a pre-localized message (message / messageZh picked by client.ts).
    // Only fall back to a local placeholder when the server didn't send a message at all.
    if (error.message) return error.message;
    return tt("errors.generic", "Something went wrong. Please try again.");
  }

  if (error instanceof Error) {
    // Network errors (fetch failures, CORS, etc.)
    if (error.message === "Failed to fetch") {
      return tt("errors.network", "Unable to connect to the server. Please check your network.");
    }
    return error.message;
  }

  return tt("errors.unexpected", "An unexpected error occurred. Please try again.");
}

export function notifyError(error: unknown) {
  message.error(getErrorMessage(error));
}

export function notifySuccess(text: string) {
  message.success(text);
}
