import { Calendar, Clock, Download, Wallet } from "lucide-react";
import type { useTranslation } from "react-i18next";
import { ConfigProvider } from "antd";
import type { Dayjs } from "dayjs";
import { AppCardLayout, AppButton, CopyButton } from "@/components/shared";
import { AppRangePicker } from "@/components/shared/Form";
import { GRADIENTS } from "@/constants/gradients";
import type { TronGasOverview } from "@/api";
import { formatDate } from "@/utils";

type T = ReturnType<typeof useTranslation>["t"];

interface NettsAccountCardProps {
  t: T;
  account: TronGasOverview["account"];
  exportRange: [Dayjs | null, Dayjs | null] | null;
  setExportRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  onExport: () => void;
}

function formatTrx(value: number, fractionDigits = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export const NettsAccountCard = ({
  t,
  account,
  exportRange,
  setExportRange,
  onExport,
}: NettsAccountCardProps) => {
  return (
    <AppCardLayout
      icon={
        <span className="w-8 h-8 rounded-[10px] bg-orange-50 flex items-center justify-center">
          <Wallet size={16} className="text-orange-500" />
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
        <div className="flex items-center gap-2">
          <div className="hidden md:block w-90">
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
          <AppButton onClick={onExport}>
            <Download size={16} className="mr-1" />
            {t("nettsAccount.exportConsumption")}
          </AppButton>
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
