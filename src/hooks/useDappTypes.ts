import { useQuery } from "@tanstack/react-query";
import { queryKeys, dappsApi } from "@/api";

interface UseDappTypesOptions {
  enabled?: boolean;
}

/**
 * Dapp types from `/dapp-types`. These ids align with a dapp entry's `typeId`,
 * so they are the correct source for the listing's type filter (categories from
 * `/dapp/types` are a different id-space).
 */
export const useDappTypes = (options: UseDappTypesOptions = {}) => {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.dapps.types(),
    queryFn: () => dappsApi.getTypes(),
    enabled,
  });

  return {
    types: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
};
