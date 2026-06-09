import { ConfigProvider } from "antd";
import { Wallet, Calendar, Download, Clock } from "lucide-react";

const ManualUpdateIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4.55214 3.69385C6.01297 2.43073 7.91725 1.66667 10 1.66667C14.6023 1.66667 18.3333 5.39762 18.3333 10C18.3333 11.7801 17.7752 13.4298 16.8243 14.7838L14.1667 10H16.6667C16.6667 6.3181 13.6819 3.33333 10 3.33333C8.20818 3.33333 6.58147 4.04022 5.38352 5.19035L4.55214 3.69385ZM15.4478 16.3062C13.987 17.5692 12.0827 18.3333 10 18.3333C5.39762 18.3333 1.66667 14.6023 1.66667 10C1.66667 8.21988 2.22482 6.57013 3.17567 5.2162L5.83333 10H3.33333C3.33333 13.6819 6.3181 16.6667 10 16.6667C11.7918 16.6667 13.4185 15.9598 14.6165 14.8097L15.4478 16.3062Z"
      fill="#155DFC"
    />
  </svg>
);
import type { Dayjs } from "dayjs";
import { AppCardLayout, CopyButton } from "@/components/shared";
import { AppButton } from "@/components/shared/AppButton";
import { AppRangePicker } from "@/components/shared/Form";
import { GRADIENTS } from "@/constants/gradients";
import { formatDate } from "@/utils";
import type { TronGasOverview } from "@/api";
import { formatTrx, type TronGasT } from "../state";

interface Props {
  t: TronGasT;
  account: TronGasOverview["account"];
  exportRange: [Dayjs | null, Dayjs | null] | null;
  setExportRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  onExport: () => void;
  onManualUpdate: () => void;
  isUpdating: boolean;
}

export const NettsAccountCard = ({
  t,
  account,
  exportRange,
  setExportRange,
  onExport,
  onManualUpdate,
  isUpdating,
}: Props) => {
  return (
    <AppCardLayout
      icon={
        <span className="w-9 h-9 rounded-[10px] bg-[#FFEDD4] flex items-center justify-center">
          <Wallet size={20} className="text-[#F54900]" />
        </span>
      }
      title={
        <span
          className="text-[20px] font-semibold text-primary"
          style={{ lineHeight: "30px", letterSpacing: "-0.45px" }}
        >
          {t("nettsAccount.title")}
        </span>
      }
      subtitle={
        <span
          className="text-[14px] font-normal text-[#6A7282]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("nettsAccount.description")}
        </span>
      }
      headerClassName="pb-2"
      action={
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 w-full lg:w-auto">
          <div className="w-full md:w-64 lg:w-90 shrink-0">
            <ConfigProvider
              theme={{
                token: { colorTextPlaceholder: "rgba(10, 10, 10, 0.5)" },
              }}
            >
              <AppRangePicker
                value={exportRange}
                onChange={(value) => setExportRange(value as [Dayjs | null, Dayjs | null] | null)}
                placeholder={[t("nettsAccount.selectRange"), ""]}
                style={{ width: "100%", height: 40, borderRadius: 10, borderColor: "#D1D5DC" }}
                suffixIcon={<Calendar size={16} className="text-[#6A7282]" />}
              />
            </ConfigProvider>
          </div>
          <div className="flex flex-row md:flex-wrap md:items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onManualUpdate}
              disabled={isUpdating}
              aria-label={t("nettsAccount.manualUpdate")}
              className="shrink-0 inline-flex items-center justify-center gap-2 h-10 w-10 md:w-auto md:px-6 md:py-2 rounded-[10px] bg-[#F0F4FF] hover:bg-[#E0E7FF] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              style={{
                color: "#155DFC",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: "-0.312px",
              }}
            >
              <ManualUpdateIcon className={isUpdating ? "animate-spin" : ""} />
              <span className="hidden md:inline">{t("nettsAccount.manualUpdate")}</span>
            </button>
            <AppButton
              onClick={onExport}
              disabled={!exportRange?.[0] || !exportRange?.[1]}
              className="flex-1 md:flex-none md:w-auto justify-center"
            >
              <Download size={16} className="mr-1" />
              {t("nettsAccount.exportConsumption")}
            </AppButton>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div
          className="rounded-[10px] border border-[#BEDBFF] p-4"
          style={{ background: GRADIENTS.tronGasBalance }}
        >
          <p
            className="text-[14px] font-normal mb-1"
            style={{ color: "#1447E6", lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("nettsAccount.currentBalance")}
          </p>
          <p
            className="text-[30px] font-bold"
            style={{ color: "#1C398E", lineHeight: "36px", letterSpacing: "0.4px" }}
          >
            {formatTrx(account.balance, 2)} {account.balanceSymbol}
          </p>
          <p
            className="text-[12px] font-normal mt-1"
            style={{ color: "#155DFC", lineHeight: "16px" }}
          >
            {t("nettsAccount.currentBalanceCaption")}
          </p>
        </div>
        <div
          className="rounded-[10px] border border-[#FFC9C9] p-4"
          style={{ background: GRADIENTS.tronGasAlert }}
        >
          <p
            className="text-[14px] font-normal mb-1"
            style={{ color: "#C10007", lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("nettsAccount.totalConsumed")}
          </p>
          <p
            className="text-[30px] font-bold"
            style={{ color: "#82181A", lineHeight: "36px", letterSpacing: "0.4px" }}
          >
            {formatTrx(account.consumed, 2)} {account.consumedSymbol}
          </p>
          <p
            className="text-[12px] font-normal mt-1"
            style={{ color: "#E7000B", lineHeight: "16px" }}
          >
            {t("nettsAccount.totalConsumedCaption")}
          </p>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 mb-4 flex flex-col gap-2">
        <span
          className="text-[14px] font-normal"
          style={{ color: "#4A5565", lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("nettsAccount.rechargeAddress")}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 h-11 px-4 inline-flex items-center bg-white border border-[#D1D5DC] rounded-[10px]">
            <code className="text-sm text-gray-700 font-mono truncate">
              {account.rechargeAddress}
            </code>
          </div>
          <CopyButton
            text={account.rechargeAddress}
            size={18}
            className="shrink-0 w-11 h-11 inline-flex items-center justify-center bg-white border border-[#D1D5DC] rounded-[10px] hover:bg-gray-50!"
          />
        </div>
        {(() => {
          const lastUpdate = account.lastUpdate;
          if (!lastUpdate) return null;
          return (
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-[#6A7282]" />
              <span
                className="text-[12px] font-normal"
                style={{ color: "#6A7282", lineHeight: "16px" }}
              >
                {t("nettsAccount.lastUpdate", { time: formatDate(lastUpdate) })}
              </span>
            </div>
          );
        })()}
      </div>

      {account.needsTopUp &&
        (() => {
          const warning = t("nettsAccount.topUpWarning");
          const colonIdx = warning.search(/[:：]/);
          const prefix = colonIdx >= 0 ? warning.slice(0, colonIdx + 1) : warning;
          const rest = colonIdx >= 0 ? warning.slice(colonIdx + 1) : "";
          return (
            <div
              className="rounded-[10px] border px-4 py-3"
              style={{ backgroundColor: "#FEFCE8", borderColor: "#FFF085" }}
            >
              <p
                className="text-[14px]"
                style={{ color: "#894B00", lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                <span style={{ fontWeight: 500 }}>{prefix}</span>
                <span style={{ fontWeight: 400 }}>{rest}</span>
              </p>
            </div>
          );
        })()}
    </AppCardLayout>
  );
};
