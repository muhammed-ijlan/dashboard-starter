import { Calendar, Clock, Users } from "lucide-react";
import type { useTranslation } from "react-i18next";

type T = ReturnType<typeof useTranslation>["t"];
import { AppCardLayout } from "@/components/shared";
import { AppInput, AppDatePicker } from "@/components/shared/Form";
import { ScopeOption } from "./ScopeOption";
import type { FormState } from "./types";

const FREE_COUNT_MIN = 0;
const FREE_COUNT_MAX = 10;

interface FreeQuotaConfigurationCardProps {
  t: T;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState | null>>;
  canManage: boolean;
}

export const FreeQuotaConfigurationCard = ({
  t,
  form,
  setForm,
  canManage,
}: FreeQuotaConfigurationCardProps) => {
  return (
    <AppCardLayout
      icon={
        <span className="w-9 h-9 rounded-[10px] bg-[#DBEAFE] flex items-center justify-center">
          <Calendar size={20} className="text-blue-500" />
        </span>
      }
      title={
        <span
          className="text-[20px] font-semibold text-primary"
          style={{ lineHeight: "30px", letterSpacing: "-0.45px" }}
        >
          {t("freeQuota.title")}
        </span>
      }
      subtitle={
        <span
          className="text-[14px] font-normal text-[#6A7282]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("freeQuota.description")}
        </span>
      }
      headerClassName="pb-2"
    >
      <div className="flex flex-col gap-1.5 mb-5">
        <label
          className="text-[14px] font-medium text-[#364153]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("freeQuota.monthlyCount")}
        </label>
        <AppInput
          value={form.freeMonthlyCount ?? ""}
          disabled={!canManage}
          inputMode="numeric"
          className="w-64! h-10.5! py-2! px-4! border-[#D1D5DC]!"
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, "");
            if (cleaned === "") {
              setForm((prev) => (prev ? { ...prev, freeMonthlyCount: null } : prev));
              return;
            }
            const clamped = Math.min(Math.max(Number(cleaned), FREE_COUNT_MIN), FREE_COUNT_MAX);
            setForm((prev) => (prev ? { ...prev, freeMonthlyCount: clamped } : prev));
          }}
        />
        <span className="text-[12px] font-normal text-[#6A7282]" style={{ lineHeight: "16px" }}>
          {t("freeQuota.monthlyCountHelp")}
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <label
          className="text-[14px] font-medium text-[#364153]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("freeQuota.scope")}
        </label>

        <div className="flex flex-col gap-3 w-full">
          <ScopeOption
            selected={form.scope === "all"}
            canManage={canManage}
            icon={<Users size={16} strokeWidth={2} />}
            label={t("freeQuota.scopeAll")}
            onSelect={() => setForm((prev) => (prev ? { ...prev, scope: "all" } : prev))}
          />

          <ScopeOption
            selected={form.scope === "newAfter"}
            canManage={canManage}
            icon={<Clock size={16} strokeWidth={2} />}
            label={t("freeQuota.scopeNewAfter")}
            onSelect={() => setForm((prev) => (prev ? { ...prev, scope: "newAfter" } : prev))}
          >
            {form.scope === "newAfter" && (
              <div className="mt-3 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                <label
                  className="text-[14px] font-medium text-[#364153]"
                  style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
                >
                  {t("freeQuota.selectDate")}
                </label>
                <AppDatePicker
                  value={form.scopeStartDate}
                  disabled={!canManage}
                  onChange={(value) => {
                    const next = Array.isArray(value) ? null : value;
                    setForm((prev) => (prev ? { ...prev, scopeStartDate: next } : prev));
                  }}
                  placeholder={t("freeQuota.pickDate")}
                  style={{
                    width: "100%",
                    height: 38,
                    borderRadius: 10,
                    borderColor: "#D1D5DC",
                  }}
                />
              </div>
            )}
          </ScopeOption>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
        <p
          className="text-[13px] font-normal text-primary"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {t("freeQuota.resetRule")}
        </p>
      </div>
    </AppCardLayout>
  );
};
