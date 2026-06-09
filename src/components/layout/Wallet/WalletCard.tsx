import type { WalletEntry } from "@/types";
import { currencyFallback, currencyStyles, statusConfig } from "@/constants/const";
import { CopyButton, TruncatedId, DetailLinkButton } from "@/components/shared";
// import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "@/routes/paths";
import { WalletDetailModal } from "./WalletDetailModal";
import { AppCardLayout } from "@/components/shared/AppCardLayout";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

export const WalletCard = memo(({ wallet }: { wallet: WalletEntry }) => {
  const { t, i18n } = useTranslation(Namespace.Wallet);

  const [detailOpen, setDetailOpen] = useState(false);

  const statusFallback = { background: "#f3f4f6", textColor: "#374151" };
  const status = statusConfig[wallet.status] || statusFallback;

  // const isPositive = wallet.change24h >= 0;

  const styles = currencyStyles[wallet.currency as keyof typeof currencyStyles] || currencyFallback;

  return (
    <>
      <AppCardLayout contentClassName="flex flex-col lg:flex-row lg:items-center p-4 lg:p-[17px] gap-4">
        <div className="lg:py-2.5 flex items-center gap-4 shrink-0">
          <span
            className={`rounded-[10px] flex items-center justify-center shrink-0 p-4 font-medium border-2 ${styles.bg} ${styles.border} ${styles.text}`}
          >
            {wallet.currency}
          </span>
        </div>

        <div className="flex flex-col gap-3 lg:gap-1.5 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-caption font-normal text-secondary shrink-0">
              {t("address")}:
            </span>
            <TruncatedId value={wallet.address} startChars={15} endChars={15} />
            <div className="flex items-center gap-2 shrink-0 mt-1 lg:mt-0">
              <CopyButton text={wallet.address} />
              <DetailLinkButton onClick={() => setDetailOpen(true)} />
            </div>
          </div>

          <div className="flex items-center gap-y-2 gap-x-4 flex-wrap text-caption font-normal text-secondary">
            <span className="whitespace-nowrap inline-flex items-center gap-1.5">
              {t("user")}:
              {wallet.user === "Anonymous" ? (
                <TruncatedId value={wallet.user} startChars={8} endChars={8} variant="plain" />
              ) : (
                <Link
                  to={`/${routes.USERS}?search=${encodeURIComponent(wallet.user)}`}
                  state={{ scrollToList: true }}
                  className="cursor-pointer hover:underline"
                >
                  <TruncatedId
                    value={wallet.user}
                    startChars={8}
                    endChars={8}
                    variant="plain"
                    className="cursor-pointer!"
                  />
                </Link>
              )}
            </span>
            <span className="whitespace-nowrap">
              {t("transactions")} :{" "}
              <span className="text-primary">{wallet.transactions.toLocaleString()}</span>
            </span>
            <span className="whitespace-nowrap">
              {t("lastActivity")}:{" "}
              <span className="text-primary">
                {formatTimeAgo(wallet.lastActivity, i18n.language)}
              </span>
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0"
              style={{ background: status.background, color: status.textColor }}
            >
              {t(`status.${wallet.status.toLowerCase()}`, wallet.status)}
            </span>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end shrink-0 gap-2 lg:gap-0.5 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <span className="text-lg lg:text-xl font-bold text-gray-900">
            {wallet.balance.toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}
            {wallet.currency ? ` ${wallet.currency}` : ""}
          </span>
          {/* <div className="flex items-center justify-end lg:items-end gap-2 lg:gap-0.5 lg:flex-col flex-wrap">
            <span className="text-sm text-gray-400">≈ ${wallet.balanceUSD.toFixed(2)}</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(wallet.change24h).toFixed(2)}% (24h)
            </span>
          </div> */}
        </div>
      </AppCardLayout>

      <WalletDetailModal
        open={detailOpen}
        address={wallet.address}
        currency={wallet.currency}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
});
