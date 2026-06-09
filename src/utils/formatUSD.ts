/**
 * Format a number as USD currency.
 * - Below 100K: full dollar format, e.g. "$58,340.50", "$850.00"
 * - 100K+: compact with suffix, e.g. "$2.4M", "$350K"
 */
export function formatUSD(value: number, decimals = 2): string {
  if (value === 0) return "$0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e18) {
    return `${sign}$${(abs / 1e18).toFixed(decimals).replace(/\.?0+$/, "")}Qi`;
  }
  if (abs >= 1e15) {
    return `${sign}$${(abs / 1e15).toFixed(decimals).replace(/\.?0+$/, "")}Q`;
  }
  if (abs >= 1_000_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000_000).toFixed(decimals).replace(/\.?0+$/, "")}T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(decimals).replace(/\.?0+$/, "")}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(decimals).replace(/\.?0+$/, "")}M`;
  }
  if (abs >= 100_000) {
    return `${sign}$${(abs / 1_000).toFixed(decimals).replace(/\.?0+$/, "")}K`;
  }

  if (abs < 1) {
    return `${sign}$${Number(abs.toPrecision(3))}`;
  }

  return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
