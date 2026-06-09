import { Modal } from "antd";
import { X, Loader2, Wallet, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useWallets } from "@/hooks";
import { CopyButton, AppScrollArea, TruncatedId } from "@/components/shared";
import { statusConfig, currencyStyles, currencyFallback } from "@/constants/const";
import type { WalletDetailChain } from "@/api/wallets";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

interface WalletDetailModalProps {
  open: boolean;
  address: string | null;
  currency: string;
  onClose: () => void;
}

export function WalletDetailModal({ open, address, currency, onClose }: WalletDetailModalProps) {
  const { t, i18n } = useTranslation(Namespace.Wallet);
  const {
    detail,
    detailLoading: isLoading,
    detailError: isError,
  } = useWallets({ detailAddress: open ? address : null });

  const styles = currencyStyles[currency as keyof typeof currencyStyles] || currencyFallback;

  const getChainStatusColor = (status: string) => {
    const mapped = status.toLowerCase() === "active" ? "Normal" : "Monitoring";
    return (
      statusConfig[mapped as keyof typeof statusConfig] || {
        background: "#f3f4f6",
        textColor: "#374151",
      }
    );
  };

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
          <span
            className={`rounded-[10px] flex items-center justify-center shrink-0 w-11 h-11 font-semibold border-2 text-body ${styles.bg} ${styles.border} ${styles.text}`}
          >
            {currency}
          </span>
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
          {/* Address */}
          <div className="bg-surface-muted rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={14} className="text-secondary" />
              <span className="text-caption font-semibold text-secondary uppercase tracking-wide">
                {t("address")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-caption text-primary break-all flex-1 font-mono">
                {detail.address}
              </code>
              <CopyButton text={detail.address} />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-[10px] p-3.5 border border-border-primary">
              <span className="text-caption font-normal text-secondary block mb-1">
                {t("detail.balance")}
              </span>
              <p className="text-body font-semibold text-primary truncate">
                {detail.totalBalance.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>
            <div className="bg-surface rounded-[10px] p-3.5 border border-border-primary">
              <span className="text-caption font-normal text-secondary block mb-1">
                {t("detail.chains")}
              </span>
              <p className="text-body font-semibold text-primary truncate">
                {detail.chains.length}
              </p>
            </div>
          </div>

          {/* User & Last Active */}
          {(detail.userId || detail.lastActive) && (
            <div className="flex items-center gap-4 text-caption font-normal text-secondary">
              {detail.userId && (
                <span className="inline-flex items-center gap-1.5">
                  {t("user")}:
                  <TruncatedId value={detail.userId} startChars={8} endChars={8} variant="plain" />
                </span>
              )}
              {detail.lastActive && (
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-secondary" />
                  {t("lastActivity")}:{" "}
                  <span className="text-primary font-medium">
                    {formatTimeAgo(detail.lastActive, i18n.language)}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Chain Details */}
          {detail.chains.length > 0 && (
            <div>
              <h4 className="text-body font-semibold text-primary mb-3">
                {t("detail.chainDetails")}
              </h4>
              <AppScrollArea maxHeight="max-h-65">
                <div className="flex flex-col gap-2.5">
                  {detail.chains.map((chain: WalletDetailChain, index: number) => {
                    const chainStatus = getChainStatusColor(chain.status);
                    return (
                      <div
                        key={`${chain.chain}-${index}`}
                        className="bg-surface-muted rounded-[10px] p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-body font-semibold text-primary truncate max-w-60">
                            {chain.chainLabel}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-caption font-medium shrink-0"
                            style={{
                              background: chainStatus.background,
                              color: chainStatus.textColor,
                            }}
                          >
                            {t(`status.${chain.status.toLowerCase()}`, chain.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                          <div className="min-w-0">
                            <span className="text-caption font-normal text-secondary block mb-0.5">
                              {t("detail.balance")}
                            </span>
                            <span className="text-body font-medium text-primary block truncate">
                              {chain.balance.toLocaleString(undefined, {
                                maximumFractionDigits: 6,
                              })}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-caption font-normal text-secondary block mb-0.5">
                              {t("detail.created")}
                            </span>
                            <span className="text-body font-medium text-primary block truncate">
                              {formatTimeAgo(chain.createdAt, i18n.language)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AppScrollArea>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
