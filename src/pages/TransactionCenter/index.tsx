import {
  StatCard,
  StatCardSkeleton,
  // DailyTransactionVolumeChart,
  TransactionList,
} from "@/components/layout";
import { PageHeader } from "@/components/shared";
import { useTransactionStats } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

const TransactionCenter = () => {
  const { t } = useTranslation(Namespace.Transactions);
  const { statCards, isLoading } = useTransactionStats();

  return (
    <div className="max-w-400 mx-auto w-full flex flex-col gap-6">
      <PageHeader title={t("header.title")} description={t("header.description")} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} layout="standard" size="lg" />
            ))
          : statCards.map((stat) => (
              <StatCard
                key={stat.id}
                layout="standard"
                title={stat.title}
                value={stat.value}
                valueClassName={stat.valueClassName}
                IconComponent={stat.icon}
                iconContainerClassName={stat.iconContainerClassName}
                iconClassName={stat.iconClassName}
                size="lg"
              />
            ))}
      </div>
      {/* <DailyTransactionVolumeChart /> */}
      <TransactionList />
    </div>
  );
};

export default TransactionCenter;
