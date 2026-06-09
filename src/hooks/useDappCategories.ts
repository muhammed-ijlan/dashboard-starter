import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys, dappsApi } from "@/api";
import type {
  CreateDappCategoryPayload,
  DappCategoryListParams,
  UpdateDappCategoryPayload,
} from "@/api";

interface UseDappCategoriesOptions {
  params?: DappCategoryListParams;
  enabled?: boolean;
}

export const useDappCategories = (options: UseDappCategoriesOptions = {}) => {
  const { params, enabled = true } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.dapps.categories(params),
    queryFn: () => dappsApi.getCategories(params),
    enabled,
  });

  const invalidateCategories = () => {
    void queryClient.invalidateQueries({ queryKey: [...queryKeys.dapps.all, "categories"] });
  };

  const invalidateDappList = () => {
    void queryClient.invalidateQueries({ queryKey: [...queryKeys.dapps.all, "list"] });
  };

  const invalidateTypes = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.dapps.types() });
  };

  const createCategory = useMutation({
    mutationFn: (payload: CreateDappCategoryPayload) => dappsApi.createCategory(payload),
    onSuccess: () => {
      invalidateCategories();
      invalidateTypes();
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDappCategoryPayload }) =>
      dappsApi.updateCategory(id, payload),
    onSuccess: (_data, { id }) => {
      invalidateCategories();
      invalidateDappList();
      invalidateTypes();
      void queryClient.invalidateQueries({ queryKey: queryKeys.dapps.category(id) });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => dappsApi.deleteCategory(id),
    onSuccess: () => {
      invalidateCategories();
      invalidateDappList();
      invalidateTypes();
    },
  });

  return {
    categories: query.data?.list,
    total: query.data?.pagination.total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

interface UseDappCategoryOptions {
  enabled?: boolean;
}

export const useDappCategory = (id: number | null, options: UseDappCategoryOptions = {}) => {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.dapps.category(id ?? 0),
    queryFn: () => dappsApi.getCategory(id as number),
    enabled: enabled && typeof id === "number" && id > 0,
  });

  return {
    category: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};
