import { api } from "./client";
import { endpoints } from "./endpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  account: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginUser {
  id: number;
  account: string;
  email: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: LoginUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResult {
  token: string;
  expiresIn: number;
  message: string;
}

export interface MeResult {
  id: number;
  account: string;
  role: string;
  twoFactorEnabled: boolean;
  /** Server timestamp of last enable/confirm. Null/absent when 2FA is disabled. */
  twoFactorConfirmedAt?: string | null;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) => api.post<LoginResult>(endpoints.auth.login, payload),

  logout: () => api.post<{ message: string }>(endpoints.auth.logout, {}),

  changePassword: (payload: ChangePasswordPayload) =>
    api.post<ChangePasswordResult>(endpoints.auth.changePassword, payload),

  me: () => api.get<MeResult>(endpoints.auth.me),
};
