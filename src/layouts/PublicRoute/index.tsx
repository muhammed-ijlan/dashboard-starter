import { Navigate } from "react-router-dom";
import { routes } from "@/routes/paths";
import { useAuthStore } from "@/store";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={`/${routes.DASHBOARD}`} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
