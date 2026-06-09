import type { SidebarMenuItem } from "./Sidebar.types";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  Smartphone,
  Zap,
  Shield,
  // Settings,
} from "lucide-react";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    key: "dashboard",
    label: "sidebar.dashboard",
    path: "/dashboard",
    module: "dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "users",
    label: "sidebar.users",
    path: "/users",
    module: "userCenter",
    icon: Users,
  },
  {
    key: "wallet",
    label: "sidebar.wallets",
    path: "/wallet",
    module: "wallet",
    icon: Wallet,
  },
  {
    key: "transactions",
    label: "sidebar.transactions",
    path: "/transactions",
    module: "transaction",
    icon: ArrowLeftRight,
  },
  {
    key: "dapp",
    label: "sidebar.dapps",
    path: "/dapps",
    module: "dapp",
    icon: Smartphone,
  },
  {
    key: "tronGas",
    label: "sidebar.tronGas",
    path: "/settings",
    module: "tronGas",
    icon: Zap,
  },
  {
    key: "admin",
    label: "sidebar.admins",
    path: "/admin",
    module: "admin",
    icon: Shield,
  },
  // {
  //   key: "system",
  //   label: "sidebar.system",
  //   path: "/system",
  //   module: "system",
  //   icon: Settings,
  // },
];
