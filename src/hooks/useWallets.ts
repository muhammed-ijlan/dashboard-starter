import { queryKeys } from "@/api";
import { walletApi } from "@/api/wallets";
import { useQuery } from "@tanstack/react-query";

interface UseWalletsOptions {
  listParams?: { page: number; limit: number; search?: string };
  detailAddress?: string | null;
}

export const useWallets = (options: UseWalletsOptions = {}) => {
  const { listParams, detailAddress } = options;

  const summaryQuery = useQuery({
    queryKey: queryKeys.walletCenter.summary(),
    queryFn: walletApi.getSummary,
  });

  const listQuery = useQuery({
    queryKey: queryKeys.walletCenter.wallets(
      listParams || ({} as NonNullable<UseWalletsOptions["listParams"]>),
    ),
    queryFn: () =>
      walletApi.getWallets(listParams || ({} as NonNullable<UseWalletsOptions["listParams"]>)),
    placeholderData: (prev) => prev,
    enabled: !!listParams,
  });

  const detailQuery = useQuery({
    queryKey: queryKeys.walletCenter.detail(detailAddress ?? ""),
    queryFn: () => walletApi.getWalletDetail(detailAddress!),
    enabled: !!detailAddress,
  });

  return {
    summary: summaryQuery.data,
    wallets: listQuery.data,
    detail: detailQuery.data,

    summaryLoading: summaryQuery.isLoading,
    walletsLoading: listQuery.isLoading,
    walletsFetching: listQuery.isFetching,
    detailLoading: detailQuery.isLoading,

    summaryError: summaryQuery.isError,
    detailError: detailQuery.isError,

    refetchAll: () => {
      summaryQuery.refetch();
    },
  };
};
