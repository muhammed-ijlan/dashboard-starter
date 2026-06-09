import type { SizeVariant, SizeConfig, ColorConfig } from "@/types";

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

export const COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  success: "#22C55E",
  warning: "#F59E0B",
  info: "#3B82F6",
  error: "#EF4444",
  neutral: "#8E8E93",
};

/** Icons */
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

export const statusColorConfig: Record<string, ColorConfig> = {
  active: { background: "#F0FDF4", textColor: "#16A34A" },
  inactive: { background: "#F3F4F6", textColor: "#6B7280" },
  warning: { background: "#FFFBEB", textColor: "#D97706" },
  error: { background: "#FFF1F2", textColor: "#E11D48" },
};

export const badgeFallback: ColorConfig = {
  background: "#F3F4F6",
  textColor: "#6B7280",
};
