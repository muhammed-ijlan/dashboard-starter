import React, { useEffect } from "react";
import { Layout, Drawer } from "antd";
import { X } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarFooter } from "./SidebarFooter";

const { Sider } = Layout;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && visible) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visible, onClose]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white relative">
      <div className="relative">
        <SidebarHeader />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none flex items-center justify-center p-2 transition-colors rounded-[10px] cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto" aria-label="Main Navigation">
        <SidebarMenu onClose={onClose} />
      </nav>

      <div className="shrink-0">
        <SidebarFooter onClose={onClose} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Layout */}
      <Sider width={256} className="bg-white border-r border-default hidden md:block" theme="light">
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
        styles={{ body: { padding: 0 }, wrapper: { width: 256 } }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};
