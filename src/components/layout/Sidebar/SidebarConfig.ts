import type { SidebarMenuItem } from "./Sidebar.types";
import { LayoutDashboard } from "lucide-react";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    key: "dashboard",
    label: "sidebar.dashboard",
    path: "/dashboard",
    module: "dashboard",
    icon: LayoutDashboard,
  },
];
