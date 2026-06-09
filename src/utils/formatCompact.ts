/**
 * Format a count (users, wallets, transactions, etc.)
 * - Below 100K: comma-separated integer, e.g. "12,458", "8,234"
 * - 100K+: compact with K/M/B/T suffixes, e.g. "1.2M", "350K"
 */
export function formatCompact(value: number, decimals = 1): string {
  if (value === 0) return "0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e18) {
    return `${sign}${(abs / 1e18).toFixed(decimals).replace(/\.0+$/, "")}Qi`;
  }
  if (abs >= 1e15) {
    return `${sign}${(abs / 1e15).toFixed(decimals).replace(/\.0+$/, "")}Q`;
  }
  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toFixed(decimals).replace(/\.0+$/, "")}T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(decimals).replace(/\.0+$/, "")}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(decimals).replace(/\.0+$/, "")}M`;
  }
  if (abs >= 100_000) {
    return `${sign}${(abs / 1_000).toFixed(decimals).replace(/\.0+$/, "")}K`;
  }

  if (abs > 0 && abs < 1) {
    return `${sign}${Number(abs.toPrecision(3))}`;
  }

  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
