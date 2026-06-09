import dayjs, { type Dayjs } from "dayjs";
import type { TFunction } from "i18next";
import type { FreeQuotaScope, TronGasConfig } from "@/api";

export type TronGasT = TFunction<"tronGas", undefined>;

export const FREE_COUNT_MIN = 0;
export const FREE_COUNT_MAX = 10;

export interface FormState {
  energyOptimizationEnabled: boolean;
  userFeeAmount: number | null;
  platformCost: number | null;
  freeMonthlyCount: number | null;
  scope: FreeQuotaScope;
  scopeStartDate: Dayjs | null;
}

export function toFormState(config: TronGasConfig): FormState {
  return {
    energyOptimizationEnabled: config.energyOptimizationEnabled,
    userFeeAmount: config.userFeeAmount,
    platformCost: config.platformCost,
    freeMonthlyCount: config.freeMonthlyCount,
    scope: config.scope,
    scopeStartDate: config.scopeStartDate ? dayjs(config.scopeStartDate) : null,
  };
}

export function toConfig(form: FormState): TronGasConfig {
  return {
    energyOptimizationEnabled: form.energyOptimizationEnabled,
    userFeeAmount: form.userFeeAmount ?? 0,
    platformCost: form.platformCost ?? 0,
    freeMonthlyCount: form.freeMonthlyCount ?? 0,
    scope: form.scope,
    scopeStartDate: form.scopeStartDate ? form.scopeStartDate.format("YYYY-MM-DD") : null,
  };
}

export function formatTrx(value: number, fractionDigits = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
