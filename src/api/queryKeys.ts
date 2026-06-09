export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    permissions: () => [...queryKeys.auth.all, "permissions"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
} as const;
