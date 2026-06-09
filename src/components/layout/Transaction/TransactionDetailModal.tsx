import { Modal } from "antd";
import {
  X,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Hash,
  Wallet,
  Clock,
  CircleCheckBig,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useTransactions } from "@/hooks";
import { CopyButton, TruncatedId } from "@/components/shared";
import { formatDate } from "@/utils";

interface TransactionDetailModalProps {
  open: boolean;
  txHash: string | null;
  typeKey?: string;
  walletAddress?: string;
  onClose: () => void;
}

const typeConfig: Record<
  string,
  { label: string; Icon: typeof ArrowDownLeft; bg: string; text: string }
> = {
  receive: {
    label: "Receive",
    Icon: ArrowDownLeft,
    bg: "bg-green-100",
    text: "text-green-700",
  },
  send: {
    label: "Send",
    Icon: ArrowUpRight,
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
};

const statusConfig: Record<string, { Icon: typeof CircleCheckBig; bg: string; text: string }> = {
  Completed: {
    Icon: CircleCheckBig,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  Processing: { Icon: Clock, bg: "bg-yellow-50", text: "text-yellow-600" },
  Failed: { Icon: XCircle, bg: "bg-red-50", text: "text-red-600" },
};

const FALLBACK_STATUS = {
  Icon: CircleCheckBig,
  bg: "bg-green-50",
  text: "text-green-600",
};

function normalizeStatusLabel(raw: string): string {
  const s = (raw ?? "").toLowerCase().trim();
  if (s === "pending") return "Processing";
  if (s === "success" || s === "completed") return "Completed";
  return "Failed";
}

export function TransactionDetailModal({
  open,
  txHash,
  typeKey,
  walletAddress,
  onClose,
}: TransactionDetailModalProps) {
  const { t } = useTranslation([Namespace.Transactions, "common"]);
  const {
    detail,
    detailLoading: isLoading,
    detailError: isError,
  } = useTransactions({
    detailTxHash: open ? txHash : null,
    detailTypeKey: open ? typeKey : undefined,
    detailWalletAddress: open ? walletAddress : undefined,
  });

  const resolvedTypeKey = (detail?.typeKey ?? detail?.type ?? "").toLowerCase();
  const type = typeConfig[resolvedTypeKey];
  const typeLabel = detail ? t(`card.type.${resolvedTypeKey}`, detail.type) : "";
  const resolvedLabel = detail
    ? normalizeStatusLabel(detail.status || detail.statusLabel)
    : "Completed";
  const status = statusConfig[resolvedLabel] ?? FALLBACK_STATUS;
  const statusText = String(t(`common:status.${resolvedLabel.toLowerCase()}` as never));

  const TypeIcon = type?.Icon;

  const feeDisplay = detail
    ? (detail.feeText ??
      (detail.feeSymbol
        ? `${detail.fee.toLocaleString()} ${detail.feeSymbol}`
        : detail.fee.toLocaleString()))
    : "";

  const amountDisplay = detail ? `${detail.amount} ${detail.tokenSymbol ?? ""}`.trim() : "";
  const STACK_THRESHOLD = 14;
  const stackStats = amountDisplay.length > STACK_THRESHOLD || feeDisplay.length > STACK_THRESHOLD;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      closeIcon={false}
      destroyOnHidden
      styles={{ body: { padding: 24 } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-primary">
        <div className="flex items-center gap-3">
          {type && TypeIcon && (
            <span
              className={`rounded-[10px] flex items-center justify-center shrink-0 w-11 h-11 border-2 border-border-primary ${type.bg} ${type.text}`}
            >
              <TypeIcon size={22} strokeWidth={2.5} />
            </span>
          )}
          <div>
            <h3 className="text-[18px] font-semibold leading-7 text-primary">
              {t("detail.title")}
            </h3>
            <p className="text-caption font-normal text-secondary mt-0.5">{t("detail.subtitle")}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer"
        >
          <X size={18} className="text-secondary" />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="animate-spin w-8 h-8 text-secondary" />
          <span className="text-caption font-normal text-secondary">{t("detail.loading")}</span>
        </div>
      ) : isError || !detail ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-body font-normal text-red-500">{t("detail.error")}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Tx Hash */}
          <div className="bg-surface-muted rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={14} className="text-secondary" />
              <span className="text-caption font-semibold text-secondary uppercase tracking-wide">
                {t("detail.txHash")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-caption text-primary break-all flex-1 font-mono">
                {detail.txHash}
              </code>
              <CopyButton text={detail.txHash} />
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-surface-muted rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={14} className="text-secondary" />
              <span className="text-caption font-semibold text-secondary uppercase tracking-wide">
                {t("detail.wallet")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-caption text-primary break-all flex-1 font-mono">
                {detail.walletAddress}
              </code>
              <CopyButton text={detail.walletAddress} />
            </div>
          </div>

          {/* Summary Stats */}
          <div className={`grid gap-3 ${stackStats ? "grid-cols-1" : "grid-cols-2"}`}>
            <div className="bg-surface rounded-[10px] p-3.5 border border-border-primary min-w-0">
              <span className="text-caption font-normal text-secondary block mb-1">
                {t("detail.amount")}
              </span>
              <p className="text-body font-semibold text-primary break-all leading-snug">
                {amountDisplay}
              </p>
            </div>
            <div className="bg-surface rounded-[10px] p-3.5 border border-border-primary min-w-0">
              <span className="text-caption font-normal text-secondary block mb-1">
                {t("detail.fee")}
              </span>
              <p className="text-body font-semibold text-primary break-all leading-snug">
                {feeDisplay}
              </p>
            </div>
            {/* {import.meta.env.VITE_APP_ENV === "production" && (
              <div className="bg-surface rounded-[10px] p-3.5 border border-border-primary">
                <span className="text-caption font-normal text-secondary block mb-1">
                  {t("detail.confirmations")}
                </span>
                <p className="text-body font-semibold text-primary truncate">
                  {detail.confirmations}
                </p>
              </div>
            )} */}
          </div>

          {/* Meta: type, status, time, user */}
          <div className="bg-surface-muted rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-caption font-normal text-secondary">{t("detail.type")}</span>
              {type && TypeIcon && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-medium ${type.bg} ${type.text}`}
                >
                  <TypeIcon size={12} strokeWidth={2.5} />
                  {typeLabel}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-caption font-normal text-secondary">{t("detail.status")}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-medium ${status.bg} ${status.text}`}
              >
                <status.Icon size={12} strokeWidth={2.5} />
                {statusText}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-caption font-normal text-secondary">{t("detail.time")}</span>
              <span className="text-caption font-medium text-primary flex items-center gap-1.5">
                <Clock size={12} className="text-secondary" />
                {formatDate(detail.time)}
              </span>
            </div>

            {detail.user && (
              <div className="flex items-center justify-between gap-3 min-w-0">
                <span className="text-caption font-normal text-secondary shrink-0">
                  {t("detail.user")}
                </span>
                <TruncatedId
                  value={detail.user}
                  startChars={8}
                  endChars={8}
                  variant="plain"
                  className="text-caption font-medium font-mono min-w-0"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
