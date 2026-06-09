import { Menu, ConfigProvider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarMenu } from "./SidebarConfig";
import { usePermissions } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

export const SidebarMenu = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { canView } = usePermissions();
  const { t } = useTranslation(Namespace.Common);

  const items = sidebarMenu
    .filter((item) => !item.module || canView(item.module))
    .map((item) => ({
      key: item.path,
      icon: item.icon ? <item.icon size={20} strokeWidth={2} /> : null,
      label: <span className="text-body! font-medium tracking-wide">{t(item.label)}</span>,
    }));

  const handleMenuClick = (key: string) => {
    navigate(key);
    onClose();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 w-full">
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHeight: 48,
              itemColor: "#364153",
              itemHoverBg: "#F3F4F6",
              itemHoverColor: "#111827",
              itemSelectedBg: "#EFF6FF",
              itemSelectedColor: "#155DFC",
              activeBarWidth: 0,
            },
          },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => handleMenuClick(key)}
          className="border-none bg-transparent custom-sidebar-menu"
        />
      </ConfigProvider>
    </div>
  );
};
