import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, dappsApi } from "@/api";
import type { DAppListParams, CreateDappsPayload, UpdateDappsPayload } from "@/api/dapps";

interface UseDappsOptions {
  listParams?: DAppListParams;
}

export const useDapps = (options: UseDappsOptions = {}) => {
  const { listParams } = options;
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: queryKeys.dapps.summary(),
    queryFn: () => dappsApi.getSummary(),
  });

  const listQuery = useQuery({
    queryKey: queryKeys.dapps.list(listParams || ({} as DAppListParams)),
    queryFn: () => dappsApi.getList(listParams || ({} as DAppListParams)),
    enabled: !!listParams,
    placeholderData: (prev) => prev,
  });

  const typesQuery = useQuery({
    queryKey: queryKeys.dapps.types(),
    queryFn: () => dappsApi.getTypes(),
  });

  // --- Mutations ---

  const invalidateAfterDappChange = () => {
    void queryClient.invalidateQueries({ queryKey: [...queryKeys.dapps.all, "list"] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dapps.summary() });
    // dapp create/update/delete shifts category.dappCount
    void queryClient.invalidateQueries({ queryKey: [...queryKeys.dapps.all, "categories"] });
  };

  const createDappMutation = useMutation({
    mutationFn: (payload: CreateDappsPayload) => dappsApi.createDapp(payload),
    onSuccess: invalidateAfterDappChange,
  });

  const updateDappMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDappsPayload }) =>
      dappsApi.updateDapp(id, payload),
    onSuccess: invalidateAfterDappChange,
  });

  const deleteDappMutation = useMutation({
    mutationFn: (id: number) => dappsApi.deleteDapp(id),
    onSuccess: invalidateAfterDappChange,
  });

  return {
    summary: summaryQuery.data,
    dapps: listQuery.data,
    types: typesQuery.data,

    summaryLoading: summaryQuery.isLoading,
    dappsLoading: listQuery.isLoading,
    dappsFetching: listQuery.isFetching,

    createDapp: createDappMutation,
    updateDapp: updateDappMutation,
    deleteDapp: deleteDappMutation,
  };
};
