import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Zap, TrendingUp, Save, DollarSign } from "lucide-react";
import { message } from "antd";
import { type Dayjs } from "dayjs";
import { Namespace } from "@/i18n/namespaces";
import { useTronGas, usePermissions } from "@/hooks";
import { PageHeader, notifySuccess } from "@/components/shared";
import { AppButton } from "@/components/shared/AppButton";
import { StatCard } from "@/components/layout";
import { PermissionKey } from "@/constants/permissionKeys";
import { tronGasApi } from "@/api";
import { downloadServerExport } from "@/utils/exportExcel";
import { TronGasSkeleton } from "./TronGasSkeleton";
import {
  FREE_COUNT_MAX,
  FREE_COUNT_MIN,
  type FormState,
  formatTrx,
  toConfig,
  toFormState,
} from "./state";
import { GasFeeConfigurationCard, NettsAccountCard } from "./components";

const TronGas = () => {
  const { t } = useTranslation(Namespace.TronGas);
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(PermissionKey.TronGasManage);

  const { overview, isLoading, saveConfig, isSaving, syncNettsAccount, isSyncingNettsAccount } =
    useTronGas();

  const [form, setForm] = useState<FormState | null>(null);
  const [exportRange, setExportRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Initialise local form state once the overview arrives. React docs recommend
  // adjusting state during render over a sync-down useEffect:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (overview && form === null) {
    setForm(toFormState(overview.config));
  }

  const userFeeTrx = useMemo<number | null>(() => {
    if (!form || form.userFeeAmount == null || form.platformCost == null) return null;
    return (form.userFeeAmount * form.platformCost) / 100;
  }, [form]);

  const profit = useMemo<{ perTx: number | null; margin: number | null }>(() => {
    if (!form || form.userFeeAmount == null || form.platformCost == null || userFeeTrx == null) {
      return { perTx: null, margin: null };
    }
    return {
      perTx: userFeeTrx - form.platformCost,
      margin: form.userFeeAmount - 100,
    };
  }, [form, userFeeTrx]);

  if (isLoading || !overview || !form) {
    return <TronGasSkeleton />;
  }

  const formActive = form.energyOptimizationEnabled;
  const inputsDisabled = !canManage || !formActive;

  const handleSave = async () => {
    if (!canManage) {
      message.error(t("noPermission"));
      return;
    }
    if (form.userFeeAmount == null || form.userFeeAmount <= 0) {
      message.error(t("validation.userFeeRange"));
      return;
    }
    if (form.platformCost == null || form.platformCost <= 0) {
      message.error(t("validation.costRange"));
      return;
    }
    if (
      form.freeMonthlyCount == null ||
      form.freeMonthlyCount < FREE_COUNT_MIN ||
      form.freeMonthlyCount > FREE_COUNT_MAX
    ) {
      message.error(t("validation.freeCountRange"));
      return;
    }
    if (form.scope === "newAfter" && !form.scopeStartDate) {
      message.error(t("validation.dateRequired"));
      return;
    }
    try {
      await saveConfig(toConfig(form));
      message.success(t("actions.saveSuccess"));
    } catch {
      message.error(t("actions.saveFailed"));
    }
  };

  const handleManualUpdate = async () => {
    try {
      await syncNettsAccount();
      notifySuccess(t("nettsAccount.syncSuccess"));
    } catch {
      // global MutationCache.onError handles the error toast
    }
  };

  const handleExport = () => {
    const start = exportRange?.[0];
    const end = exportRange?.[1];
    if (!start || !end) return;
    const startDate = start.format("YYYY-MM-DD");
    const endDate = end.format("YYYY-MM-DD");
    void downloadServerExport(() => tronGasApi.exportNettsConsumption({ startDate, endDate }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <PageHeader
        title={t("header.title")}
        description={t("header.description")}
        actions={
          <AppButton onClick={handleSave} disabled={!canManage || isSaving} loading={isSaving}>
            <Save size={16} className="mr-1" />
            {t("actions.save")}
          </AppButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          layout="standard"
          title={t("stats.energyStatus")}
          value={formActive ? t("stats.energyStatusEnabled") : t("stats.energyStatusDisabled")}
          valueClassName={formActive ? "text-primary" : "text-secondary"}
          subtitle={t("stats.energyStatusCaption")}
          IconComponent={Zap}
          iconContainerClassName="bg-[#F3E8FF] rounded-[10px] w-9 h-9"
          iconClassName="text-[#9810FA]"
        />
        <StatCard
          layout="standard"
          title={t("stats.userFee")}
          value={
            userFeeTrx == null
              ? "—"
              : `${formatTrx(userFeeTrx)} ${overview.stats.totalProfitSymbol}`
          }
          valueClassName="text-green-600"
          subtitle={t("stats.userFeeCaption")}
          IconComponent={DollarSign}
          iconContainerClassName="bg-[#DCFCE7] rounded-[10px] w-9 h-9"
          iconClassName="text-[#00A63E]"
        />
        {/* TODO: re-enable Free Quota stat card */}
        {/* <StatCard
          layout="standard"
          title={t("stats.freeQuota")}
          value={form.freeMonthlyCount == null ? "—" : String(form.freeMonthlyCount)}
          valueClassName="text-[#155DFC]!"
          subtitle={t("stats.freeQuotaCaption")}
          IconComponent={Calendar}
          iconContainerClassName="bg-[#DBEAFE] rounded-[10px] w-9 h-9"
          iconClassName="text-[#155DFC]"
        /> */}
        <StatCard
          layout="standard"
          title={t("stats.totalProfit")}
          value={`${formatTrx(overview.stats.totalProfit)} ${overview.stats.totalProfitSymbol}`}
          valueClassName="text-[24px]! tracking-[0.07px] text-[#F54900]!"
          subtitle={t("stats.totalProfitCaption")}
          IconComponent={TrendingUp}
          iconContainerClassName="bg-[#FFEDD4] rounded-[10px] w-9 h-9"
          iconClassName="text-[#F54900]"
        />
      </div>

      <GasFeeConfigurationCard
        t={t}
        form={form}
        setForm={setForm}
        inputsDisabled={inputsDisabled}
        canManage={canManage}
        profit={profit}
        stats={overview.stats}
      />

      {/* TODO: re-enable Free Quota Configuration card */}
      {/* <FreeQuotaConfigurationCard t={t} form={form} setForm={setForm} canManage={canManage} /> */}

      <NettsAccountCard
        t={t}
        account={overview.account}
        exportRange={exportRange}
        setExportRange={setExportRange}
        onExport={handleExport}
        onManualUpdate={() => void handleManualUpdate()}
        isUpdating={isSyncingNettsAccount}
      />
    </div>
  );
};

export default TronGas;
