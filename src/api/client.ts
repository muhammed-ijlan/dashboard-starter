import { useAuthStore } from "@/store";
import { ApiError } from "./types";
import type { ApiResponse } from "./types";
import i18n from "@/i18n/i18n";

function getLocalizedMessage(message: string, messageZh?: string): string {
  return i18n.language === "zh" && messageZh ? messageZh : message;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

let unauthorizedInFlight = false;

function handleUnauthorized(requestToken: string | null) {
  if (unauthorizedInFlight) return;
  const currentToken = useAuthStore.getState().token;
  if (!currentToken) return;
  if (currentToken !== requestToken) return;
  unauthorizedInFlight = true;
  useAuthStore.getState().clearAuth();
  window.location.replace("/login");
}

// Test-only: reset the 401 guard between tests. Not part of the public API.
export function __resetUnauthorizedGuardForTest() {
  unauthorizedInFlight = false;
}

function isAuthFlowErrorCode(code: string | undefined): boolean {
  return !!code && code.startsWith("TWO_FACTOR_");
}

type Params = Record<string, string | number | boolean>;

export interface DownloadResult {
  blob: Blob;
  filename: string;
}

function buildUrl(path: string, params?: Params): string {
  const url = new URL(`${BASE_URL.replace(/\/$/, "")}${path}`);
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      url.searchParams.set(key, String(val));
    }
  }
  return url.toString();
}

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8 && utf8[1]) return decodeURIComponent(utf8[1]);
  const plain = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return plain && plain[1] ? plain[1] : fallback;
}

async function downloadRequest(
  path: string,
  params: Params | undefined,
  fallbackFilename: string,
): Promise<DownloadResult> {
  const token = useAuthStore.getState().token;
  const response = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    if (response.status === 401) {
      handleUnauthorized(token);
    }
    let serverMessage = response.statusText;
    let serverCode = response.status;
    try {
      const body = (await response.json()) as {
        code?: number;
        message?: string;
        messageZh?: string;
      };
      if (body.message) serverMessage = getLocalizedMessage(body.message, body.messageZh);
      if (typeof body.code === "number") serverCode = body.code;
      if (response.ok && body.code === 0) {
        // 200 with JSON success envelope but no binary body — nothing to download
        throw new ApiError(0, serverMessage, 0);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
      // body wasn't JSON — keep statusText
    }
    throw new ApiError(serverCode, serverMessage, response.status);
  }

  const filename = parseFilename(response.headers.get("Content-Disposition"), fallbackFilename);
  const blob = await response.blob();
  return { blob, filename };
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Params;
  body?: unknown;
}

export function buildPaginatedQueryParams(
  params: { page?: number; limit?: number; search?: string } | undefined,
): Params {
  const out: Params = {};
  if (params?.page != null) out.page = params.page;
  if (params?.limit != null) out.limit = params.limit;
  if (params?.search) out.search = params.search;
  return out;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers: extraHeaders, ...init } = options;

  const url = new URL(`${BASE_URL.replace(/\/$/, "")}${path}`);
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      url.searchParams.set(key, String(val));
    }
  }

  const token = useAuthStore.getState().token;

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    let serverMessage = "";
    let serverErrorCode: string | undefined;
    let serverData: unknown;
    try {
      const body = (await response.json()) as {
        code?: number | string;
        message?: string;
        messageZh?: string;
        data?: unknown;
      };
      if (body.message) serverMessage = getLocalizedMessage(body.message, body.messageZh);
      if (typeof body.code === "string") serverErrorCode = body.code;
      serverData = body.data;
      if (response.status === 401 || body.code === 401) {
        if (!isAuthFlowErrorCode(serverErrorCode)) handleUnauthorized(token);
        throw new ApiError(401, serverMessage, 401, serverErrorCode, serverData);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
      // no JSON body
    }
    if (response.status === 401) {
      if (!isAuthFlowErrorCode(serverErrorCode)) handleUnauthorized(token);
      throw new ApiError(401, serverMessage, 401, serverErrorCode, serverData);
    }
    throw new ApiError(
      response.status,
      serverMessage,
      response.status,
      serverErrorCode,
      serverData,
    );
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (json.code === 401) {
    handleUnauthorized(token);
    throw new ApiError(401, getLocalizedMessage(json.message, json.messageZh));
  }

  if (json.code !== 0) {
    const numericCode = typeof json.code === "number" ? json.code : response.status;
    const errorCode = typeof json.code === "string" ? json.code : undefined;
    throw new ApiError(
      numericCode,
      getLocalizedMessage(json.message, json.messageZh),
      response.status,
      errorCode,
      json.data,
    );
  }

  return json.data;
}

export const api = {
  get: <T>(path: string, params?: Params) => request<T>(path, { method: "GET", params }),

  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),

  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),

  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  download: (path: string, fallbackFilename: string, params?: Params) =>
    downloadRequest(path, params, fallbackFilename),
};
