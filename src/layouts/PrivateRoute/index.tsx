import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { queryKeys } from "@/api";
import { routes } from "@/routes/paths";

const ROUTE_REFRESH_THROTTLE_MS = 10_000;

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const queryClient = useQueryClient();
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    const now = Date.now();
    if (now - lastRefreshRef.current < ROUTE_REFRESH_THROTTLE_MS) return;
    lastRefreshRef.current = now;
    void queryClient.invalidateQueries({ queryKey: queryKeys.auth.permissions() });
  }, [isAuthenticated, location.pathname, queryClient]);

  if (!isAuthenticated) {
    return <Navigate to={`/${routes.LOGIN}`} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
