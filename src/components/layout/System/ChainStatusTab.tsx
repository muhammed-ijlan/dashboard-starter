import { RefreshCw, Link, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { AppButton, AppCardLayout } from "@/components/shared";
import type { ApiChain } from "@/api";
import { useSystem } from "@/hooks";
import { useTranslation } from "react-i18next";
import { formatTimeAgo } from "@/utils";
import { Namespace } from "@/i18n/namespaces";
import { GRADIENTS } from "@/constants/gradients";
import { ChainCardSkeleton } from "./skeletons";

const statusConfig: Record<
  string,
  { bg: string; text: string; Icon: React.ElementType; barColor: string }
> = {
  healthy: {
    bg: "bg-green-50",
    text: "text-green-600",
    Icon: CheckCircle,
    barColor: "bg-green-500",
  },
  syncing: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    Icon: Loader,
    barColor: "bg-yellow-400",
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-600",
    Icon: AlertCircle,
    barColor: "bg-red-500",
  },
};

const FALLBACK_STATUS = {
  bg: "bg-gray-50",
  text: "text-gray-600",
  Icon: AlertCircle,
  barColor: "bg-gray-400",
};

/** Parse "100.00%" → 100 */
function parseSyncProgress(value: string): number {
  return parseFloat(value) || 0;
}

function ChainCard({ chain }: { chain: ApiChain }) {
  const { t, i18n } = useTranslation(Namespace.System);
  const status = statusConfig[chain.status] ?? FALLBACK_STATUS;
  const syncValue = parseSyncProgress(chain.syncProgress);

  return (
    <AppCardLayout className="pt-6" contentClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: GRADIENTS.chainCardIcon,
            }}
          >
            <Link className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[15px] text-gray-900">{chain.chain}</p>
          </div>
        </div>
        <span
          className={`capitalize inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-medium ${status.bg} ${status.text}`}
        >
          <status.Icon className="w-3.5 h-3.5" />
          {t(`chainStatusTab.status.${chain.status}`, chain.status)}
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-2">
        {[
          {
            label: t("chainStatusTab.fields.blockHeight"),
            value: chain.blockHeight.toLocaleString(),
          },
          {
            label: t("chainStatusTab.fields.latestBlock"),
            value: chain.latestBlockTime
              ? formatTimeAgo(chain.latestBlockTime, i18n.language)
              : "-",
          },
          {
            label: t("chainStatusTab.fields.nodeConnection"),
            value: `${chain.peers} peers`,
          },
          {
            label: t("chainStatusTab.fields.networkHashrate"),
            value: chain.hashrate,
          },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-body font-normal">
            <span className="text-muted">{row.label}</span>
            <span className="text-primary font-semibold">{row.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-caption text-gray-500 mb-1.5">
          <span>{t("chainStatusTab.fields.syncProgress")}</span>
          <span>{chain.syncProgress}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${status.barColor}`}
            style={{ width: `${syncValue}%` }}
          />
        </div>
      </div>
    </AppCardLayout>
  );
}

export function ChainStatusTab() {
  const { t } = useTranslation(Namespace.System);
  const {
    chains: data,
    chainsLoading: isLoading,
    chainsFetching: isFetching,
    refetchChains: refetch,
  } = useSystem();
  const chains = data?.chains ?? [];
  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body text-muted">
          {t("chainStatusTab.monitoring", { count: chains.length })}
        </p>
        <AppButton
          variant="secondary"
          className="flex items-center gap-2 shrink-0"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{t("chainStatusTab.refresh")}</span>
        </AppButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <ChainCardSkeleton key={i} />
          ))}
        </div>
      ) : chains.length > 0 ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isRefreshing ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {chains.map((chain) => (
            <ChainCard key={chain.chain} chain={chain} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400 text-body">
          {t("chainStatusTab.empty", "No chains found")}
        </div>
      )}
    </div>
  );
}
