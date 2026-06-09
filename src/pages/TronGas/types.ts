import type { Dayjs } from "dayjs";
import type { FreeQuotaScope } from "@/api";

export interface FormState {
  energyOptimizationEnabled: boolean;
  userFeeAmount: number | null;
  platformCost: number | null;
  freeMonthlyCount: number | null;
  scope: FreeQuotaScope;
  scopeStartDate: Dayjs | null;
}
