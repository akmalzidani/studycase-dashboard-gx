import { hasPermission } from "@/config/permission.helpers";
import { useAuthStore } from "@/stores/useAuthStore";

import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, user, permissions } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredPermission &&
    !hasPermission(permissions, `${requiredPermission}.read`)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
