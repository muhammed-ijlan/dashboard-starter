import { transactionsApi, queryKeys } from "@/api";
import type { TransactionListParams } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface UseTransactionsOptions {
  listParams?: TransactionListParams;
  detailTxHash?: string | null;
  detailTypeKey?: string;
  detailWalletAddress?: string;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const { listParams, detailTxHash, detailTypeKey, detailWalletAddress } = options;
  const detailParams = { typeKey: detailTypeKey, walletAddress: detailWalletAddress };

  const summaryQuery = useQuery({
    queryKey: queryKeys.transactions.summary(),
    queryFn: transactionsApi.getSummary,
  });

  const volume24hQuery = useQuery({
    queryKey: queryKeys.transactions.volume24h(),
    queryFn: transactionsApi.getVolume24h,
  });

  const volume7dQuery = useQuery({
    queryKey: queryKeys.transactions.volume7d(),
    queryFn: transactionsApi.getVolume7d,
  });

  const listQuery = useQuery({
    queryKey: queryKeys.transactions.list(listParams),
    queryFn: () => transactionsApi.getList(listParams),
    placeholderData: (prev) => prev,
    enabled: !!listParams,
  });

  const detailQuery = useQuery({
    queryKey: queryKeys.transactions.detail(detailTxHash ?? "", detailParams),
    queryFn: () => transactionsApi.getDetail(detailTxHash!, detailParams),
    enabled: !!detailTxHash,
  });

  return {
    summary: summaryQuery.data,
    volume24h: volume24hQuery.data,
    volume7d: volume7dQuery.data,
    list: listQuery.data,
    detail: detailQuery.data,

    summaryLoading: summaryQuery.isLoading,
    volume24hLoading: volume24hQuery.isLoading,
    volume7dLoading: volume7dQuery.isLoading,
    listLoading: listQuery.isLoading,
    listFetching: listQuery.isFetching,
    detailLoading: detailQuery.isLoading,

    detailError: detailQuery.isError,
  };
};
