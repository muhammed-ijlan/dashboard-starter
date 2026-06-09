import { toggleLanguage } from "@/i18n/helpers";
import { Languages, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header = ({ onOpenMenu }: HeaderProps) => {
  const { t, i18n } = useTranslation(Namespace.Common);
  const currentLanguage = i18n.language;

  const formattedDate = new Intl.DateTimeFormat(currentLanguage, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] shrink-0 flex items-center justify-between md:justify-end px-6 py-[15.5px]">
      <button
        onClick={onOpenMenu}
        className="md:hidden text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none flex items-center justify-center p-2 transition-colors rounded-[10px] cursor-pointer"
      >
        <Menu size={18} className="text-[18px]" />
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="flex cursor-pointer items-center gap-2 px-3 py-1.5  hover:bg-gray-200 hover:text-[black] text-muted rounded-[10px] transition-colors "
        >
          <Languages size={16} />
          <span className="text-body font-medium  tracking-[-0.15px]">
            {t("header.language")}
          </span>
        </button>

        <div className="text-body font-normal  text-secondary tracking-[-0.15px]">
          {formattedDate}
        </div>
      </div>
    </header>
  );
};

export default Header;
