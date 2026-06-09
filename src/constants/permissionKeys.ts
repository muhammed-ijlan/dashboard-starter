export const PermissionKey = {
  DashboardView: "dashboard.view",
} as const;

export type PermissionKey = (typeof PermissionKey)[keyof typeof PermissionKey];
