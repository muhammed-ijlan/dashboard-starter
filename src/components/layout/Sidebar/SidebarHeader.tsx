import { LayoutDashboard } from "lucide-react";

export const SidebarHeader = () => {
  return (
    <div className="h-16 flex items-center px-6 py-[15.7px] shrink-0 border-b border-default">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <LayoutDashboard className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-primary tracking-tight leading-none">
          Admin Dashboard
        </span>
      </div>
    </div>
  );
};
