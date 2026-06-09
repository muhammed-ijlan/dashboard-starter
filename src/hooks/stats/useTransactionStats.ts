import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@/constants/const";
import { formatCompact } from "@/utils";
import { Namespace } from "@/i18n/namespaces";
import { useTransactions } from "../useTransactions";

export const useTransactionStats = () => {
  const { summary, summaryLoading: isLoading } = useTransactions();
  const { t } = useTranslation(Namespace.Transactions);

  const statCards = useMemo(() => {
    return [
      {
        id: "total",
        title: t("statCard.title.todaysTrx"),
        value: summary != null ? formatCompact(summary.total) : "--",
        valueClassName: "text-blue-500",
        icon: ICONS.activity,
        iconContainerClassName: "bg-blue-100",
        iconClassName: "text-blue-500",
      },
      {
        id: "pending",
        title: t("statCard.title.pending"),
        value: summary != null ? formatCompact(summary.pending) : "--",
        valueClassName: "text-yellow-500",
        icon: ICONS.clock,
        iconContainerClassName: "bg-yellow-100",
        iconClassName: "text-yellow-500",
      },
      {
        id: "successRate",
        title: t("statCard.title.successRate"),
        value: summary != null ? `${summary.successRate.toFixed(2)}%` : "--",
        valueClassName: "text-green-500",
        icon: ICONS.check,
        iconContainerClassName: "bg-green-100",
        iconClassName: "text-green-500",
      },
    ];
  }, [summary, t]);

  return { statCards, isLoading };
};
