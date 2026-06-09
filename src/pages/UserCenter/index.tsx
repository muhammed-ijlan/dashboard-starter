import {
  StatCard,
  StatCardSkeleton,
  PlatformDistribution,
  UserCenterTable,
} from "@/components/layout";
import { PageHeader } from "@/components/shared";
import { useUserCenterStats } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

const UserCenter = () => {
  const { t } = useTranslation(Namespace.Users);

  const { summary, statCards, isLoading } = useUserCenterStats();

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <PageHeader title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} layout="standard" size="lg" showSubtitle />
            ))
          : statCards.map((card) => (
              <StatCard
                key={card.id}
                layout="standard"
                title={card.title}
                value={card.value}
                valueClassName={card.valueColor}
                subtitle={card.subtitle}
                subtitleType={card.subtitleType}
                IconComponent={card.icon}
                iconContainerClassName={card.iconBgColor}
                iconClassName={card.iconColor}
                size="lg"
              />
            ))}
      </div>

      <PlatformDistribution data={summary?.platformDistribution} />
      <UserCenterTable />
    </div>
  );
};

export default UserCenter;
