export type WalletStatus = "Normal" | "Monitoring" | "Frozen";
export type Currency = "BTC" | "ETH" | "USDT" | "BNB" | "OKT";

export interface WalletEntry {
  id: string;
  currency: string;
  address: string;
  user: string;
  transactions: number;
  lastActivity: string;
  status: WalletStatus;
  balance: number;
  balanceUSD: number;
  change24h: number;
  shortAddress?: string;
}
