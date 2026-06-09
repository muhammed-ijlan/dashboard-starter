export const Namespace = {
  Common: "common",
  Admin: "admin",
  Auth: "auth",
  Dashboard: "dashboard",
  Dapps: "dapps",
  Profile: "profile",
  System: "system",
  TronGas: "tronGas",
  Transactions: "transactions",
  Users: "users",
  Wallet: "wallet",
} as const;

export type Namespace = (typeof Namespace)[keyof typeof Namespace];
