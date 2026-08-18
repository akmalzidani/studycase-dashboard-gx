import { hasPermission } from "@/config/permission.helpers";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AppPermission } from "@/types/permission.types";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredPermission?: AppPermission;
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredPermission &&
    !hasPermission(user.permission, requiredPermission)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
