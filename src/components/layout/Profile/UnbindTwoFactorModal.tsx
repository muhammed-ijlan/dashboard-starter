import { useRef, useState } from "react";
import { Modal } from "antd";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppButton } from "@/components/shared";

interface UnbindTwoFactorModalProps {
  open: boolean;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: (code: string) => void;
}

export const UnbindTwoFactorModal = ({
  open,
  submitting = false,
  onCancel,
  onConfirm,
}: UnbindTwoFactorModalProps) => {
  const { t } = useTranslation([Namespace.Profile, Namespace.Common]);
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    setCode("");
    onCancel();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(next);
  };

  const isValid = code.length === 6;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      afterOpenChange={(opened) => {
        if (opened) inputRef.current?.focus();
      }}
      closeIcon={false}
      destroyOnHidden
      centered
      footer={null}
      width={520}
    >
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#C10007]" strokeWidth={2.2} />
          <span
            className="text-[18px] font-semibold text-[#C10007]"
            style={{ lineHeight: "18px", letterSpacing: "-0.44px" }}
          >
            {t("security.unbind.title")}
          </span>
        </div>
        <button
          onClick={handleCancel}
          aria-label="Close"
          className="p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer"
        >
          <X size={18} className="text-secondary" />
        </button>
      </div>

      <div className="px-6 pt-8 pb-6 flex flex-col gap-5">
        <div className="bg-[#FEF2F2] border border-[#FFE2E2] rounded-[10px] p-5 flex flex-col gap-2">
          <h4
            className="text-[14px] font-medium text-[#82181A]"
            style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("security.unbind.warning.title")}
          </h4>
          <ul
            className="text-[12px] font-normal text-[#82181A] list-none m-0 p-0 flex flex-col gap-1"
            style={{ lineHeight: "16px" }}
          >
            <li>{t("security.unbind.warning.line1")}</li>
            <li>{t("security.unbind.warning.line2")}</li>
            <li>{t("security.unbind.warning.line3")}</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-normal text-primary" style={{ lineHeight: "16px" }}>
            {t("security.unbind.codeLabel")}
          </label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            maxLength={6}
            className="rounded-[10px] px-4 py-3 outline-none focus:border-[#155DFC] transition-colors"
            style={{
              background: "#F3F3F5",
              borderTop: "1px solid #E5E7EB",
              boxShadow: "0px 0px 0px 0.48px #A1A1A114",
              color: "#101828",
              fontFamily: "Menlo, monospace",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "1.4px",
              textAlign: "center",
            }}
          />
          <span className="text-[12px] font-normal text-secondary" style={{ lineHeight: "16px" }}>
            {t("security.unbind.codeHelper")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <AppButton variant="secondary" onClick={handleCancel} disabled={submitting}>
            {t("common:actions.cancel")}
          </AppButton>
          <AppButton
            disabled={!isValid || submitting}
            loading={submitting}
            onClick={() => isValid && !submitting && onConfirm(code)}
            className="bg-[#E7000B]! border-[#E7000B]! hover:bg-[#C10007]! text-white! inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {!submitting && <X size={16} strokeWidth={2.5} />}
            {t("security.unbind.confirm")}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
