// TODO: replace stub implementations with your real API calls using the `api` client.
// import { api } from "./client";
// import { endpoints } from "./endpoints";

export interface LoginPayload {
  account: string;
  password: string;
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

export interface MeResult {
  id: number;
  account: string;
  role: string;
}

export const authApi = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (_: LoginPayload): Promise<LoginResult> => {
    // TODO: return api.post<LoginResult>(endpoints.auth.login, payload);
    return Promise.reject(new Error("Not implemented"));
  },

  logout: (): Promise<void> => {
    // TODO: return api.post(endpoints.auth.logout, {});
    return Promise.resolve();
  },

  me: (): Promise<MeResult> => {
    // TODO: return api.get<MeResult>(endpoints.auth.me);
    return Promise.reject(new Error("Not implemented"));
  },
};
