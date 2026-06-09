import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, CircleCheckBig, Clock, XCircle } from "lucide-react";
import type { ApiTransaction } from "@/api";
import {
  AppCardLayout,
  AppTooltip,
  TruncatedId,
  CopyButton,
  DetailLinkButton,
} from "@/components/shared";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils";
import { routes } from "@/routes/paths";

const typeConfig: Record<string, { Icon: typeof ArrowDownLeft; color: string }> = {
  receive: { Icon: ArrowDownLeft, color: "text-green-500" },
  send: { Icon: ArrowUpRight, color: "text-orange-500" },
};

const statusConfig: Record<
  string,
  {
    Icon: typeof CircleCheckBig;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  Completed: {
    Icon: CircleCheckBig,
    iconColor: "text-[#00A63E]",
    badgeBg: "bg-green-50",
    badgeText: "text-green-600",
  },
  Processing: {
    Icon: Clock,
    iconColor: "text-[#D08700]",
    badgeBg: "bg-yellow-50",
    badgeText: "text-yellow-600",
  },
  Failed: {
    Icon: XCircle,
    iconColor: "text-[#E7000B]",
    badgeBg: "bg-red-50",
    badgeText: "text-red-600",
  },
};

const FALLBACK_STATUS = {
  Icon: CircleCheckBig,
  iconColor: "text-[#00A63E]",
  badgeBg: "bg-green-50",
  badgeText: "text-green-600",
};

function normalizeStatusLabel(raw: string): string {
  const s = (raw ?? "").toLowerCase().trim();
  if (s === "pending") return "Processing";
  if (s === "success" || s === "completed") return "Completed";
  return "Failed";
}

export const TransactionCard = memo(({ record }: { record: ApiTransaction }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const { t } = useTranslation(["transactions", "common"]);
  const typeKey = (record.typeKey ?? record.type ?? "").toLowerCase();
  const type = typeConfig[typeKey];
  const resolvedLabel = normalizeStatusLabel(record.status || record.statusLabel);
  const status = statusConfig[resolvedLabel] ?? FALLBACK_STATUS;
  const statusText = String(t(`common:status.${resolvedLabel.toLowerCase()}` as never));
  const typeLabel = t(`card.type.${typeKey}`, record.type);

  const TypeIcon = type?.Icon;
  const StatusIcon = status.Icon;

  const displayIdentity = record.user || record.walletAddress;

  const feeDisplay =
    record.feeText ??
    (record.feeSymbol
      ? `${record.fee.toLocaleString()} ${record.feeSymbol}`
      : record.fee.toLocaleString());

  return (
    <>
      <AppCardLayout contentClassName="flex flex-col lg:flex-row lg:items-center justify-between p-4 lg:p-[17px] gap-4 lg:gap-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 lg:w-25 shrink-0">
            <StatusIcon size={20} className={`${status.iconColor} shrink-0`} strokeWidth={2} />
            <div className="flex items-center gap-2">
              {type && TypeIcon && <TypeIcon size={16} className={type.color} strokeWidth={2.5} />}
              <span className="text-primary font-medium text-body">{typeLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:gap-1.5 min-w-0 flex-1 w-full">
            <div className="flex items-center gap-2 text-[13px] w-full">
              <span className="text-secondary shrink-0 text-caption">{t("card.hash")}:</span>
              <TruncatedId
                value={record.txHash}
                startChars={15}
                endChars={15}
                className="flex-1 lg:flex-initial lg:max-w-fit"
              />
              <CopyButton text={record.txHash} size={14} />
              <DetailLinkButton onClick={() => setDetailOpen(true)} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 lg:gap-x-5 gap-y-2 text-secondary text-caption">
              <span className="flex items-center gap-1 min-w-0 max-w-full sm:max-w-48 lg:max-w-64">
                <span className="shrink-0">{t("card.wallet")}:</span>
                <AppTooltip
                  title={<span className="font-mono text-xs break-all">{displayIdentity}</span>}
                >
                  <Link
                    to={`/${routes.WALLET}?search=${encodeURIComponent(displayIdentity)}`}
                    state={{ scrollToList: true }}
                    className="font-mono text-primary truncate cursor-pointer hover:underline min-w-0"
                  >
                    {displayIdentity}
                  </Link>
                </AppTooltip>
              </span>
              <span className="whitespace-nowrap">
                {t("card.time")}: <span className="text-primary">{formatDate(record.time)}</span>
              </span>
              <span className="whitespace-nowrap">
                {t("card.fee")}: <span className="text-primary">{feeDisplay}</span>
              </span>
              {/* {import.meta.env.VITE_APP_ENV === "production" && (
                <span className="whitespace-nowrap">
                  {t("card.confirmations")}:{" "}
                  <span className="text-primary">{record.confirmations}</span>
                </span>
              )} */}
              <span
                className={`px-2 py-0.5 rounded-md font-medium text-caption whitespace-nowrap ${status.badgeBg} ${status.badgeText}`}
              >
                {statusText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start w-full lg:w-auto shrink-0 lg:pl-4 pt-3 lg:pt-0 border-t border-gray-100 lg:border-none mt-1 lg:mt-0 gap-1 lg:gap-0.5">
          <span className="text-[16px] lg:text-[18px] font-semibold text-primary leading-7">
            {record.amount ? record.amount : "0"}
            {record.tokenSymbol ? ` ${record.tokenSymbol}` : ""}
          </span>
          {/* <span className="text-[13px] lg:text-body text-muted font-normal">
            ≈ ${record.amountUsd.toFixed(2)}
          </span> */}
        </div>
      </AppCardLayout>

      <TransactionDetailModal
        open={detailOpen}
        txHash={record.txHash}
        typeKey={record.typeKey ?? record.type.toLowerCase()}
        walletAddress={record.walletAddress}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
});

TransactionCard.displayName = "TransactionCard";
