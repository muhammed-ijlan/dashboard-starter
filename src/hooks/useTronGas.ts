import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys, tronGasApi } from "@/api";
import type { TronGasConfig, TronGasOverview } from "@/api";

export const useTronGas = () => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: queryKeys.tronGas.overview(),
    queryFn: tronGasApi.getOverview,
  });

  const saveConfigMutation = useMutation({
    mutationFn: (config: TronGasConfig) => tronGasApi.saveConfig(config),
    onSuccess: (saved) => {
      queryClient.setQueryData<TronGasOverview | undefined>(queryKeys.tronGas.overview(), (prev) =>
        prev ? { ...prev, config: saved } : prev,
      );
    },
  });

  const syncNettsAccountMutation = useMutation({
    mutationFn: () => tronGasApi.syncNettsAccount(),
    onSuccess: (account) => {
      queryClient.setQueryData<TronGasOverview | undefined>(queryKeys.tronGas.overview(), (prev) =>
        prev ? { ...prev, account } : prev,
      );
    },
  });

  return {
    overview: overviewQuery.data,
    isLoading: overviewQuery.isLoading,
    isFetching: overviewQuery.isFetching,
    isError: overviewQuery.isError,
    refetch: overviewQuery.refetch,
    saveConfig: saveConfigMutation.mutateAsync,
    isSaving: saveConfigMutation.isPending,
    syncNettsAccount: syncNettsAccountMutation.mutateAsync,
    isSyncingNettsAccount: syncNettsAccountMutation.isPending,
  };
};
