import type { SidebarMenuItem } from "./Sidebar.types";
import { LayoutDashboard, UserCircle } from "lucide-react";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    key: "dashboard",
    label: "sidebar.dashboard",
    path: "/dashboard",
    module: "dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "profile",
    label: "sidebar.accountSettings",
    path: "/profile",
    module: "dashboard",
    icon: UserCircle,
  },
];
