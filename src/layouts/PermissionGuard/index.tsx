import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks";
import { routes } from "@/routes/paths";
import { LoadingSpinner } from "@/components/ui";

interface PermissionGuardProps {
  module: string;
  children: React.ReactNode;
}

const PermissionGuard = ({ module, children }: PermissionGuardProps) => {
  const { canView, isLoading } = usePermissions();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!canView(module)) {
    return <Navigate to={`/${routes.DASHBOARD}`} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
