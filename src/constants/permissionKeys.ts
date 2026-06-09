export const PermissionKey = {
  // Dashboard
  DashboardView: "dashboard.view",

  // Users
  UsersView: "users.view",
  UsersEdit: "users.edit",

  // Wallets
  WalletsView: "wallets.view",

  // Transactions
  TransactionsView: "transactions.view",

  // DApps
  DappsView: "dapps.view",
  DappsCreate: "dapps.create",
  DappsEdit: "dapps.edit",
  DappsDelete: "dapps.delete",

  // Admins
  AdminsView: "admins.view",
  AdminsCreate: "admins.create",
  AdminsUpdate: "admins.update",
  AdminsDelete: "admins.delete",

  // Roles
  RolesView: "roles.view",
  RolesManage: "roles.manage",

  // Permissions
  PermissionsView: "permissions.view",

  // System
  SystemView: "system.view",

  // Alerts
  AlertsView: "alerts.view",
  AlertsManage: "alerts.manage",

  // Tron Gas
  TronGasView: "trongas.view",
  TronGasManage: "trongas.manage",
} as const;

export type PermissionKey = (typeof PermissionKey)[keyof typeof PermissionKey];
