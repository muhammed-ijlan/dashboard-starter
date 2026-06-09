import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { StatCard, StatCardSkeleton } from "@/components/layout/Dashboard";
import { ICONS } from "@/constants/const";
import type { AdminEntry } from "@/types";
import type { AdminSummary } from "@/api";

interface AdminStatsPanelProps {
  data: AdminEntry[];
  summary?: AdminSummary;
  loading?: boolean;
}

export const AdminStatsPanel = ({ data, summary, loading }: AdminStatsPanelProps) => {
  const { t } = useTranslation(Namespace.Admin);

  if (loading && data.length === 0) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} layout="standard" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "total_admins",
      title: t("stat.totalAdmins"),
      value: summary?.totalAdmins ?? data.length,
      icon: ICONS.shield,
      iconBgColor: "bg-[#DBEAFE]",
      iconColor: "text-[#155DFC]",
    },
    {
      id: "active_accounts",
      title: t("stat.activeAccounts"),
      value: summary?.activeAccounts ?? data.filter((d) => d.state === "Normal").length,
      valueClassName: "text-green-600",
      icon: ICONS.circleCheck,
      iconBgColor: "bg-[#DCFCE7]",
      iconColor: "text-[#00A63E]",
    },
    {
      id: "disabled_accounts",
      title: t("stat.disabledAccounts"),
      value: summary?.disabledAccounts ?? data.filter((d) => d.state === "Disabled").length,
      valueClassName: "text-red-500",
      icon: ICONS.circleX,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          layout="standard"
          valueClassName={card.valueClassName}
          IconComponent={card.icon}
          iconClassName={card.iconColor}
          iconContainerClassName={card.iconBgColor}
        />
      ))}
    </div>
  );
};
