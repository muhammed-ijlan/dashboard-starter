import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { authApi, queryKeys } from "@/api";

export function useMeQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
