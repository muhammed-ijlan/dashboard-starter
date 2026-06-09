import type {
  SizeVariant,
  SizeConfig,
  ColorConfig,
  PlatformConfig,
  Platform,
  WalletStatus,
  Currency,
  DAppStatus,
  DAppCategory,
  AdminState,
  Admin2FA,
} from "@/types";

export const LANGUAGES = {
  EN: "en",
  ZH: "zh",
} as const;

export const LANGUAGE_STORAGE_KEY = "language";

export const SEARCH_DEBOUNCE_MS = 300;

export const STAT_CARD = {
  SIZES: {
    sm: {
      container: "w-9 h-9 rounded-[10px]",
      icon: "w-5 h-5",
      value: "text-[24px]",
    },
    lg: {
      container: "w-12 h-12 rounded-[10px]",
      icon: "w-6 h-6",
      value: "text-[30px]",
    },
  } as Record<SizeVariant, SizeConfig>,
};

import {
  Users,
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  Monitor,
  Smartphone,
  Activity,
  Clock,
  CheckCircle2,
  Shield,
  CircleCheckBig,
  CircleX,
  Link2,
  Server,
  AlertTriangle,
} from "lucide-react";

/** Colors */
export const COLORS = {
  btc: "#F2994A",
  eth: "#5C73E6",
  usdt: "#4CA173",
  others: "#8E8E93",

  warning: "#F59E0B",
  info: "#3B82F6",
  error: "#EF4444",

  chart: {
    btc: "#EFA04C",
    eth: "#687CE3",
  },
};

export const CHAIN_COLORS: Record<string, string> = {
  Ethereum: COLORS.eth,
  Bitcoin: COLORS.btc,
  USDT: COLORS.usdt,
  Others: COLORS.others,
};

/** Icon  */
export const ICONS = {
  users: Users,
  wallet: Wallet,
  transaction: ArrowRightLeft,
  trending: TrendingUp,
  monitor: Monitor,
  smartphone: Smartphone,
  activity: Activity,
  shield: Shield,
  clock: Clock,
  check: CheckCircle2,
  circleCheck: CircleCheckBig,
  circleX: CircleX,
  link2: Link2,
  server: Server,
  alertTriangle: AlertTriangle,
};

/** Platform  */
export const platformConfig: Record<Platform, PlatformConfig> = {
  iOS: {
    icon: Smartphone,
    background: "#EFF6FF",
    iconColor: "#3B82F6",
    textColor: "#3B82F6",
  },
  Android: {
    icon: Smartphone,
    background: "#F0FDF4",
    iconColor: "#22C55E",
    textColor: "#22C55E",
  },
  Web: {
    icon: Monitor,
    background: "#FAF5FF",
    iconColor: "#A855F7",
    textColor: "#A855F7",
  },
  Desktop: {
    icon: Monitor,
    background: "#FFF7ED",
    iconColor: "#F97316",
    textColor: "#F97316",
  },
};

export const currencyFallback = {
  bg: "bg-gray-100",
  border: "border-gray-200",
  text: "text-gray-700",
};

export const currencyStyles = {
  BTC: {
    bg: "bg-orange-100",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  ETH: {
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
  USDT: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  USDC: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  BNB: {
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
  ADA: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  SOL: {
    bg: "bg-green-100",
    border: "border-green-200",
    text: "text-green-700",
  },
  XRP: {
    bg: "bg-sky-100",
    border: "border-sky-200",
    text: "text-sky-700",
  },
  DOT: {
    bg: "bg-pink-100",
    border: "border-pink-200",
    text: "text-pink-700",
  },
  DOGE: {
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
};

export const currencyConfig: Record<Currency, ColorConfig> = {
  BTC: { background: "#FFEDD4", textColor: "#F54900", borderColor: "#FFD6A8" },
  ETH: { background: "#EFF6FF", textColor: "#3B82F6", borderColor: "#3B82F6" },
  USDT: { background: "#F0FDF4", textColor: "#22C55E", borderColor: "#22C55E" },
  BNB: { background: "#FFF8E1", textColor: "#F0B90B", borderColor: "#F0B90B" },
  OKT: { background: "#EEF2FF", textColor: "#6366F1", borderColor: "#6366F1" },
};

export const statusConfig: Record<WalletStatus, ColorConfig> = {
  Normal: { background: "#F0FDF4", textColor: "#16A34A" },
  Monitoring: { background: "#FFFBEB", textColor: "#D97706" },
  Frozen: { background: "#FFF1F2", textColor: "#E11D48" },
};

export const dappStatusConfig: Record<DAppStatus, ColorConfig> = {
  active: { background: "#F0FDF4", textColor: "#16A34A" },
  inactive: { background: "#F3F4F6", textColor: "#6B7280" },
};

export const dappCategoryConfig: Record<DAppCategory, ColorConfig> = {
  DeFi: { background: "#EFF6FF", textColor: "#3B82F6" },
  NFT: { background: "#FAF5FF", textColor: "#A855F7" },
  GameFi: { background: "#FFF7ED", textColor: "#F97316" },
  DEX: { background: "#F0FDF4", textColor: "#22C55E" },
  Lending: { background: "#FFFBEB", textColor: "#D97706" },
};

export const transactionTypeConfig = {
  deposit: {
    label: "Deposit",
    icon: "down",
    color: "text-green-500",
  },
  withdraw: {
    label: "Withdraw",
    icon: "up",
    color: "text-orange-500",
  },
  transfer: {
    label: "Transfer",
    icon: "right",
    color: "text-blue-500",
  },
};

export const adminStateConfig: Record<AdminState, ColorConfig & { label: string }> = {
  Normal: { background: "#F0FDF4", textColor: "#16A34A", label: "Normal" },
  Disabled: { background: "#FFF1F2", textColor: "#E11D48", label: "Disabled" },
};

export const admin2FAConfig: Record<Admin2FA, ColorConfig & { label: string }> = {
  Bound: { background: "#DCFCE7", textColor: "#16A34A", label: "Bound" },
  Unbound: { background: "#F3F4F6", textColor: "#6B7280", label: "Unbound" },
};

const ADMIN_ROLE_FALLBACK: ColorConfig = {
  background: "#F3F4F6",
  textColor: "#6B7280",
};

const ADMIN_ROLE_COLORS: Record<string, ColorConfig> = {
  "super admin": { background: "#FFE4E6", textColor: "#E11D48" },
  superadmin: { background: "#FFE4E6", textColor: "#E11D48" },
  admin: { background: "#FEF3C7", textColor: "#D97706" },
  operations: { background: "#DBEAFE", textColor: "#2563EB" },
  ops: { background: "#DBEAFE", textColor: "#2563EB" },
  "it ops": { background: "#DCFCE7", textColor: "#16A34A" },
  itops: { background: "#DCFCE7", textColor: "#16A34A" },
};

export const adminRoleColorConfig = new Proxy({} as Record<string, ColorConfig>, {
  get(_target, prop: string) {
    if (typeof prop !== "string") return ADMIN_ROLE_FALLBACK;
    const key = prop.trim().toLowerCase();
    return ADMIN_ROLE_COLORS[key] ?? ADMIN_ROLE_FALLBACK;
  },
});

export const transactionStatusConfig = {
  completed: {
    label: "Completed",
    bg: "bg-green-100",
    text: "text-green-600",
  },
  processing: {
    label: "Processing",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-100",
    text: "text-red-600",
  },
};
