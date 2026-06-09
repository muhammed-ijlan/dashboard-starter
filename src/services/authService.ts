import { authApi } from "@/api";
import { useAuthStore } from "@/store";
import type { AuthUser } from "@/types";

export const authService = {
  login: async (account: string, password: string): Promise<{ token: string; user: AuthUser }> => {
    const { token, user } = await authApi.login({ account, password });

    useAuthStore.getState().setAuth(token, {
      id: user.id,
      account: user.account,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        account: user.account,
        email: user.email,
        role: user.role,
      },
    };
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // ignore — still clear local state below
    }
    useAuthStore.getState().clearAuth();
  },
};
