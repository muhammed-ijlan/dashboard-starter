import { Modal } from "antd";
import { Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppButton } from "./AppButton";

export interface ExportConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  totalCount?: number;
}

export const ExportConfirmModal = ({
  open,
  onCancel,
  onConfirm,
  loading = false,
  totalCount,
}: ExportConfirmModalProps) => {
  const { t } = useTranslation(Namespace.Common);

  const description =
    typeof totalCount === "number"
      ? t("exportConfirm.description", { count: totalCount.toLocaleString() })
      : t("exportConfirm.descriptionUnknown");

  return (
    <Modal open={open} onCancel={onCancel} closeIcon={false} centered footer={null} width={420}>
      <div className="flex justify-between border-b border-border-primary px-5 py-3 items-center">
        <span className="font-semibold text-[17px] text-primary">{t("exportConfirm.title")}</span>
        <button
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
          className="p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-5 py-5">
        <p className="text-body text-secondary m-0">{description}</p>

        <div className="flex gap-3 mt-6">
          <AppButton variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
            {t("actions.cancel")}
          </AppButton>
          <AppButton
            className="flex-1 flex items-center justify-center gap-2"
            onClick={onConfirm}
            loading={loading}
          >
            <Download size={16} />
            {t("exportConfirm.download")}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
