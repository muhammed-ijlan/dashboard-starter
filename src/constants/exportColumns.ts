import type { ExportColumn } from "@/utils/exportExcel";

export const EXPORT_ALL_LIMIT = 10000;

export const ADMIN_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "Name", key: "name" },
  { header: "Account", key: "account" },
  { header: "Email", key: "email" },
  { header: "Role", key: "role" },
  { header: "State", key: "state" },
  { header: "Google 2FA", key: "google2FA" },
  { header: "Created At", key: "createdAt", format: "date" },
  { header: "Last Login", key: "lastLogin", format: "date" },
  { header: "Created By", key: "createdBy" },
];

export const DAPP_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "Name", key: "name" },
  { header: "Type", key: "type" },
  { header: "URL", key: "url" },
  { header: "Description", key: "description" },
  { header: "Clicks", key: "clickCount" },
  { header: "Favorites", key: "favoriteCount" },
  { header: "Status", key: "status" },
];

export const TRANSACTION_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "Type", key: "type" },
  { header: "Hash", key: "txHash" },
  { header: "Wallet", key: "walletAddress" },
  { header: "Amount", key: "amount" },
  { header: "Amount USD", key: "amountUsd" },
  { header: "Fee", key: "fee" },
  { header: "Confirmations", key: "confirmations" },
  { header: "Status", key: "statusLabel" },
  { header: "Time", key: "time", format: "date" },
];

export const USER_DEVICE_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "Device ID", key: "deviceId" },
  { header: "Platform", key: "platform" },
  { header: "Wallets", key: "walletCount" },
  { header: "Install Time", key: "installTime", format: "date" },
  { header: "Last Active", key: "lastActive", format: "date" },
];

export const ALERT_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "ID", key: "id" },
  { header: "Severity", key: "severity" },
  { header: "Message", key: "message" },
  { header: "Resolved", key: "resolved" },
  { header: "Created At", key: "createdAt", format: "date" },
];

export const SYSTEM_LOG_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "ID", key: "id" },
  { header: "Level", key: "level" },
  { header: "Source", key: "source" },
  { header: "Message", key: "message" },
  { header: "Created At", key: "createdAt", format: "date" },
];

export const WALLET_EXPORT_COLUMNS: ExportColumn[] = [
  { header: "Currency", key: "currency" },
  { header: "Address", key: "address" },
  { header: "User", key: "userId" },
  { header: "Balance", key: "balance" },
  { header: "Balance (USD)", key: "balanceUSD" },
  { header: "24h Change (%)", key: "change24h" },
  { header: "Transactions", key: "txCount" },
  { header: "Last Activity", key: "lastActivity", format: "date" },
  { header: "Status", key: "status" },
];
