import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type FreeQuotaScope = "all" | "newAfter";

export interface TronGasConfig {
  energyOptimizationEnabled: boolean;
  userFeeAmount: number;
  platformCost: number;
  freeMonthlyCount: number;
  scope: FreeQuotaScope;
  scopeStartDate: string | null;
}

export interface TronGasStats {
  totalProfit: number;
  totalProfitSymbol: string;
}

export interface NettsAccountInfo {
  balance: number;
  balanceSymbol: string;
  consumed: number;
  consumedSymbol: string;
  rechargeAddress: string;
  lastUpdate: string | null;
  needsTopUp: boolean;
}

export interface TronGasOverview {
  config: TronGasConfig;
  stats: TronGasStats;
  account: NettsAccountInfo;
}

interface ApiTronGasConfig {
  enabled: boolean;
  userChargeRate: string;
  userChargeRatePercent: string;
  platformReferenceCost: string;
  monthlyFreeQuota: number;
  freeQuotaScope: string;
  newUserStartDate: string | null;
  resetTimezone: string;
  resetRule: string;
  userChargeAmount: string;
  profitPerTx: string;
  profitRatePercent: string;
  updatedAt: string;
  updatedBy: string;
}

interface ApiNettsAccount {
  currentBalance: string | null;
  totalConsumed: string | null;
  rechargeAddress: string | null;
  totalDelegations: number | null;
  totalEnergyDelegated: number | null;
  avgRateSunEnergy: string | null;
  saveByNettsPercent: string | null;
  saveInDollars: string | null;
  trxPrice: string | null;
  networkEnergyFee: string | null;
  syncStatus: string | null;
  lastUpdatedAt: string | null;
}

interface ApiTronGasOverview {
  energyStatus: string;
  userChargeAmount: string;
  monthlyFreeQuota: number;
  totalProfit: string;
  config: ApiTronGasConfig;
  profitAnalysis: {
    profitPerTx: string;
    profitRatePercent: string;
    totalProfit: string;
  };
  nettsAccount: ApiNettsAccount;
}

const TRX_SYMBOL = "TRX";

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toScope(apiScope: string): FreeQuotaScope {
  return apiScope === "new_users_after" ? "newAfter" : "all";
}

function fromScope(scope: FreeQuotaScope): string {
  return scope === "newAfter" ? "new_users_after" : "all_users";
}

function mapConfig(c: ApiTronGasConfig): TronGasConfig {
  return {
    energyOptimizationEnabled: c.enabled,
    userFeeAmount: toNumber(c.userChargeRatePercent),
    platformCost: toNumber(c.platformReferenceCost),
    freeMonthlyCount: c.monthlyFreeQuota ?? 0,
    scope: toScope(c.freeQuotaScope),
    scopeStartDate: c.newUserStartDate || null,
  };
}

interface UpdateTronGasConfigPayload {
  enabled: boolean;
  userChargeRatePercent: string;
  platformReferenceCost: string;
  monthlyFreeQuota: number;
  freeQuotaScope: string;
  newUserStartDate: string | null;
}

function toUpdatePayload(config: TronGasConfig): UpdateTronGasConfigPayload {
  return {
    enabled: config.energyOptimizationEnabled,
    userChargeRatePercent: String(config.userFeeAmount),
    platformReferenceCost: String(config.platformCost),
    monthlyFreeQuota: config.freeMonthlyCount,
    freeQuotaScope: fromScope(config.scope),
    newUserStartDate: config.scopeStartDate,
  };
}

function mapNettsAccount(res: ApiNettsAccount): NettsAccountInfo {
  return {
    balance: toNumber(res.currentBalance),
    balanceSymbol: TRX_SYMBOL,
    consumed: toNumber(res.totalConsumed),
    consumedSymbol: TRX_SYMBOL,
    rechargeAddress: res.rechargeAddress ?? "",
    lastUpdate: res.lastUpdatedAt ?? null,
    needsTopUp: (res.syncStatus ?? "ok") !== "ok",
  };
}

function mapOverview(res: ApiTronGasOverview): TronGasOverview {
  return {
    config: mapConfig(res.config),
    stats: {
      totalProfit: toNumber(res.profitAnalysis?.totalProfit ?? res.totalProfit),
      totalProfitSymbol: TRX_SYMBOL,
    },
    account: mapNettsAccount(res.nettsAccount),
  };
}

export const tronGasApi = {
  getOverview: async (): Promise<TronGasOverview> => {
    const res = await api.get<ApiTronGasOverview>(endpoints.tronGas.overview);
    return mapOverview(res);
  },

  saveConfig: async (config: TronGasConfig): Promise<TronGasConfig> => {
    const res = await api.put<ApiTronGasConfig>(endpoints.tronGas.config, toUpdatePayload(config));
    return mapConfig(res);
  },

  exportNettsConsumption: (range: { startDate: string; endDate: string }) => {
    return api.download(
      endpoints.tronGas.nettsConsumptionExport,
      `netts-consumption-${range.startDate}_${range.endDate}.csv`,
      { startDate: range.startDate, endDate: range.endDate },
    );
  },

  syncNettsAccount: async (): Promise<NettsAccountInfo> => {
    const res = await api.post<ApiNettsAccount>(endpoints.tronGas.nettsAccountSync);
    return mapNettsAccount(res);
  },
};
