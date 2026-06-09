import { useState, useRef, useEffect } from "react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { LogOut, MoreVertical, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { routes } from "@/routes/paths";
import { GRADIENTS } from "@/constants/gradients";

export const SidebarFooter = ({ onClose }: { onClose: () => void }) => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { t } = useTranslation(Namespace.Common);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    onClose();
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await authService.logout();
    navigate(`/${routes?.LOGIN}`);
    onClose();
  };

  return (
    <div ref={containerRef} className="p-4 border-t border-default relative">
      {isMenuOpen && (
        <div
          className="absolute bottom-[calc(100%-10px)] left-4 right-4 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 px-2 py-1" id="account-menu-heading">
              {t("sidebar.account")}
            </p>
            <button
              onClick={() => handleNavigate("/profile")}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              role="menuitem"
            >
              <Settings size={16} className="text-gray-400" />
              {t("sidebar.accountSettings")}
            </button>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              role="menuitem"
            >
              <LogOut size={16} className="text-red-500" />
              {t("sidebar.logout")}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="User menu"
        className={`w-full px-4 py-3 flex items-center justify-between gap-3 shrink-0 cursor-pointer rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isMenuOpen ? "bg-gray-50" : "hover:bg-gray-50"
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-[16px] shrink-0"
            style={{ background: GRADIENTS.sidebarUserAvatar }}
          >
            {user?.account?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex flex-col overflow-hidden text-left min-w-0">
            <div className="text-body font-semibold truncate text-primary">
              {user?.account || "Unknown User"}
            </div>
            <div className="text-caption text-secondary truncate">{user?.role || ""}</div>
          </div>
        </div>

        <MoreVertical size={16} className="text-gray-400 shrink-0" />
      </button>
    </div>
  );
};
