import { systemApi, alertsApi, queryKeys } from "@/api";
import type { SystemLogListParams } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { POLLING_INTERVAL } from "@/constants/polling";

interface UseSystemOptions {
  statusEnabled?: boolean;
  logParams?: SystemLogListParams;
}

export const useSystem = (options: UseSystemOptions = {}) => {
  const { statusEnabled = true, logParams } = options;
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: queryKeys.system.status(),
    queryFn: systemApi.getStatus,
    refetchInterval: POLLING_INTERVAL,
    enabled: statusEnabled,
  });

  const chainsQuery = useQuery({
    queryKey: queryKeys.system.chains(),
    queryFn: systemApi.getChains,
  });

  const servicesQuery = useQuery({
    queryKey: queryKeys.system.services(),
    queryFn: systemApi.getServices,
  });

  const logsQuery = useQuery({
    queryKey: queryKeys.system.logs(logParams),
    queryFn: () => systemApi.getLogs(logParams),
    placeholderData: (prev) => prev,
    enabled: !!logParams,
  });

  const alertsQuery = useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: alertsApi.getAlerts,
    refetchInterval: POLLING_INTERVAL,
  });

  const resolveAlertMutation = useMutation({
    mutationFn: (id: string) => alertsApi.resolveAlert(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerts.list() });
    },
  });

  return {
    status: statusQuery.data,
    chains: chainsQuery.data,
    services: servicesQuery.data,
    logs: logsQuery.data,
    alerts: alertsQuery.data,

    statusLoading: statusQuery.isLoading,
    chainsLoading: chainsQuery.isLoading,
    servicesLoading: servicesQuery.isLoading,
    logsLoading: logsQuery.isLoading,
    alertsLoading: alertsQuery.isLoading,

    chainsFetching: chainsQuery.isFetching,
    servicesFetching: servicesQuery.isFetching,
    logsFetching: logsQuery.isFetching,
    alertsFetching: alertsQuery.isFetching,

    refetchChains: chainsQuery.refetch,
    refetchServices: servicesQuery.refetch,
    refetchAlerts: alertsQuery.refetch,
    refetchLogs: logsQuery.refetch,

    resolveAlert: resolveAlertMutation.mutate,
    resolveAlertPending: resolveAlertMutation.isPending,
  };
};
