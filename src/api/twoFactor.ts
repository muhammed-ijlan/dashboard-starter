import { api } from "./client";
import { endpoints } from "./endpoints";
import type { LoginUser } from "./auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SetupPayload {
  /** Short-lived token returned by /auth/login when 2FA setup is required. */
  setupToken: string;
}

export interface SetupResult {
  /** Base32-encoded TOTP secret. Shown to the user as the "manual entry" key. */
  secret: string;
  /** Canonical otpauth:// URI to encode into the QR code. */
  otpauthUri: string;
  /** Issuer label embedded in the URI. Useful for display. */
  issuer: string;
  /** Account label the URI is bound to. */
  account: string;
}

interface SetupApiResponse {
  secret: string;
  otpauthUrl: string;
  issuer: string;
  account: string;
}

export interface SetupAuthenticatedResult extends SetupResult {
  /** Fresh short-lived token bound to this setup attempt; pass back to confirm(). */
  setupToken: string;
  /** TTL in seconds. */
  expiresIn: number;
}

interface SetupAuthenticatedApiResponse extends SetupApiResponse {
  setupToken: string;
  expiresIn: number;
}

export interface ConfirmPayload {
  /** Same short-lived token used in setup; lets the server bind without a session. */
  setupToken: string;
  /** 6-digit Google Authenticator code the user just scanned. */
  code: string;
}

export interface ConfirmResult {
  /** Real session token, equivalent to a normal login response. */
  token: string;
  expiresIn: number;
  user: LoginUser;
}

export interface SkipSetupPayload {
  /** Short-lived token used in setup. Server issues a session without binding 2FA. */
  setupToken: string;
}

export interface DisablePayload {
  code: string;
}

export interface DisableResult {
  message: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const twoFactorApi = {
  setup: async ({ setupToken }: SetupPayload): Promise<SetupResult> => {
    const data = await api.post<SetupApiResponse>(endpoints.auth.twoFactorSetup, { setupToken });
    return {
      secret: data.secret,
      otpauthUri: data.otpauthUrl,
      issuer: data.issuer,
      account: data.account,
    };
  },

  setupAuthenticated: async (): Promise<SetupAuthenticatedResult> => {
    const data = await api.post<SetupAuthenticatedApiResponse>(
      endpoints.auth.twoFactorSetupAuthenticated,
      {},
    );
    return {
      setupToken: data.setupToken,
      expiresIn: data.expiresIn,
      secret: data.secret,
      otpauthUri: data.otpauthUrl,
      issuer: data.issuer,
      account: data.account,
    };
  },

  confirm: async ({ setupToken, code }: ConfirmPayload): Promise<ConfirmResult> => {
    return api.post<ConfirmResult>(endpoints.auth.twoFactorConfirm, {
      setupToken,
      code,
      skip: false,
    });
  },

  skipSetup: async ({ setupToken }: SkipSetupPayload): Promise<ConfirmResult> => {
    return api.post<ConfirmResult>(endpoints.auth.twoFactorConfirm, {
      setupToken,
      skip: true,
    });
  },

  disable: async ({ code }: DisablePayload): Promise<DisableResult> => {
    return api.post<DisableResult>(endpoints.auth.twoFactorDisable, { code });
  },
};
