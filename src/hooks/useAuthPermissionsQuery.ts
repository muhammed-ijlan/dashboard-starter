import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { queryKeys } from "@/api";
import { fetchAuthPermissions } from "@/services/permissions";

export function useAuthPermissionsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.permissions(),
    queryFn: fetchAuthPermissions,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
}
