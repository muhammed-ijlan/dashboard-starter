import { CircleCheckBig, TrendingUp, Zap } from "lucide-react";
import { Switch } from "antd";
import type { useTranslation } from "react-i18next";

type T = ReturnType<typeof useTranslation>["t"];
import { AppCardLayout } from "@/components/shared";
import { AppInput } from "@/components/shared/Form";
import type { TronGasOverview } from "@/api";
import type { FormState } from "./types";

function formatTrx(value: number, fractionDigits = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

interface GasFeeConfigurationCardProps {
  t: T;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState | null>>;
  inputsDisabled: boolean;
  canManage: boolean;
  profit: { perTx: number | null; margin: number | null };
  stats: TronGasOverview["stats"];
}

export const GasFeeConfigurationCard = ({
  t,
  form,
  setForm,
  inputsDisabled,
  canManage,
  profit,
  stats,
}: GasFeeConfigurationCardProps) => {
  return (
    <AppCardLayout
      icon={
        <span className="w-9 h-9 rounded-[10px] bg-[#F3E8FF] flex items-center justify-center">
          <Zap size={20} className="text-[#9810FA]" />
        </span>
      }
      title={
        <span
          className="text-[20px] font-semibold text-primary"
          style={{ lineHeight: "30px", letterSpacing: "-0.45px" }}
        >
          {t("gasConfig.title")}
        </span>
      }
      subtitle={
        <span
          className="text-[14px] font-normal text-[#6A7282]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("gasConfig.description")}
        </span>
      }
      headerClassName="pb-2"
    >
      <div className="flex items-center justify-between bg-[#F9FAFB] rounded-[10px] p-4 mb-5">
        <div>
          <p
            className="text-[16px] font-medium text-primary"
            style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
          >
            {t("gasConfig.toggleTitle")}
          </p>
          <p
            className="text-[14px] font-normal text-secondary mt-0.5"
            style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("gasConfig.toggleDescription")}
          </p>
        </div>
        <Switch
          checked={form.energyOptimizationEnabled}
          disabled={!canManage}
          onChange={(checked) =>
            setForm((prev) => (prev ? { ...prev, energyOptimizationEnabled: checked } : prev))
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[14px] font-medium text-primary"
            style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("gasConfig.userFeeAmount")}
          </label>
          <AppInput
            value={form.userFeeAmount ?? ""}
            disabled={inputsDisabled}
            inputMode="numeric"
            suffix={<span className="text-caption text-secondary">%</span>}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d.]/g, "");
              const num = cleaned === "" ? null : Number(cleaned);
              setForm((prev) =>
                prev
                  ? { ...prev, userFeeAmount: num == null || Number.isNaN(num) ? null : num }
                  : prev,
              );
            }}
          />
          <span
            className="text-[12px] font-normal"
            style={{ color: "#6A7282", lineHeight: "16px" }}
          >
            {t("gasConfig.userFeeAmountHelp")}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[14px] font-medium text-primary"
            style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("gasConfig.platformCost")}
          </label>
          <AppInput
            value={form.platformCost ?? ""}
            disabled={inputsDisabled}
            inputMode="numeric"
            suffix={
              <span
                className="text-[16px] font-normal"
                style={{ color: "#6A7282", lineHeight: "24px", letterSpacing: "-0.31px" }}
              >
                TRX
              </span>
            }
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d.]/g, "");
              const num = cleaned === "" ? null : Number(cleaned);
              setForm((prev) =>
                prev
                  ? { ...prev, platformCost: num == null || Number.isNaN(num) ? null : num }
                  : prev,
              );
            }}
          />
          <span
            className="text-[12px] font-normal"
            style={{ color: "#6A7282", lineHeight: "16px" }}
          >
            {t("gasConfig.platformCostHelp")}
          </span>
        </div>
      </div>

      <div
        className={`rounded-[10px] border p-4 mb-3 ${
          form.energyOptimizationEnabled
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-100 opacity-70"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-[#0D542B]" />
          <span
            className="text-[16px] font-medium text-[#0D542B]"
            style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
          >
            {t("gasConfig.profitAnalysis")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-caption">
          <div>
            <span className="text-[#008236]">{t("gasConfig.profitPerTx")}: </span>
            <span
              className="text-[14px] font-medium text-[#0D542B]"
              style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
            >
              {profit.perTx == null
                ? "—"
                : `${formatTrx(profit.perTx, 2)} ${stats.totalProfitSymbol}`}
            </span>
          </div>
          <div>
            <span className="text-[#008236]">{t("gasConfig.profitMargin")}: </span>
            <span
              className="text-[14px] font-medium text-[#0D542B]"
              style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
            >
              {profit.margin == null ? "—" : `${profit.margin.toFixed(1)}%`}
            </span>
          </div>
          <div>
            <span className="text-[#008236]">{t("gasConfig.totalProfit")}: </span>
            <span
              className="text-[14px] font-medium text-[#0D542B]"
              style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
            >
              {formatTrx(stats.totalProfit, 2)} {stats.totalProfitSymbol}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-[10px] p-3 border text-caption flex items-center gap-2 ${
          form.energyOptimizationEnabled
            ? "bg-blue-50 border-blue-100 text-blue-700"
            : "bg-gray-50 border-gray-100 text-gray-600"
        }`}
      >
        <CircleCheckBig size={20} />
        {form.energyOptimizationEnabled ? t("gasConfig.active") : t("gasConfig.inactive")}
      </div>
    </AppCardLayout>
  );
};
