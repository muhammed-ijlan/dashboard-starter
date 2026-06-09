export const Namespace = {
  Common: "common",
  Auth: "auth",
  Dashboard: "dashboard",
} as const;

export type Namespace = (typeof Namespace)[keyof typeof Namespace];
