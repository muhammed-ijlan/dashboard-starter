import { StatCard, StatCardSkeleton, WalletList } from "@/components/layout";
import { PageHeader } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useWalletStats } from "@/hooks";

const Wallet = () => {
  const { t } = useTranslation(Namespace.Wallet);
  const { stats, isLoading } = useWalletStats();

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <div className="flex justify-between items-center">
        <PageHeader title={t("header.title")} description={t("header.description")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} layout="standard" />)
          : stats.map((stat) => (
              <StatCard
                key={stat.id}
                layout="standard"
                title={stat.title}
                value={stat.value}
                valueClassName={stat.valueColor}
                subtitle={stat.subtitle}
                IconComponent={stat.icon}
                iconContainerClassName={stat.iconBgColor}
                iconClassName={stat.iconColor}
              />
            ))}
      </div>

      <WalletList />
    </div>
  );
};

export default Wallet;
