import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@/constants/const";
import { formatNumber } from "@/utils";
import { Namespace } from "@/i18n/namespaces";
import { useWallets } from "../useWallets";

export const useWalletStats = () => {
  const { summary, summaryLoading: isLoading } = useWallets();
  const { t } = useTranslation(Namespace.Wallet);

  const stats = useMemo(() => {
    if (!summary) return [];

    const data = summary;

    return [
      {
        id: "total_wallet",
        title: t("statCard.totalWallets"),
        value: formatNumber(data?.totalWallets ?? 0),
        subtitle: "",
        subtitleType: "positive",
        icon: ICONS.wallet,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        id: "active_wallets",
        title: t("statCard.activeWallets"),
        value: formatNumber(data?.activeWallets ?? 0),
        valueColor: "text-green-600",
        subtitle: "",
        subtitleType: "positive",
        icon: ICONS.activity,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        id: "frozen_wallets",
        title: t("statCard.frozenWallets"),
        value: formatNumber(data?.frozenWallets ?? 0),
        valueColor: "text-red-600",
        subtitle: "",
        subtitleType: "negative",
        icon: ICONS.shield,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600",
      },
    ];
  }, [summary, t]);

  return { stats, isLoading };
};
