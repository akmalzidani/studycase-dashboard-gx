import AppLayout from "@/layouts/AppLayout";
import { analyticsRoutes } from "@/paths/analytics.routes";
import { customersRoutes } from "@/paths/customers.routes";
import { dashboardRoutes } from "@/paths/dashboard.routes";
import { profileRoutes } from "@/paths/profile.routes";
import { prospectRoutes } from "@/paths/prospect.routes";
import { subscriptionRoutes } from "@/paths/subscription.routes";
import { usersRoutes } from "@/paths/users.routes";
import { ProtectedRoute } from "@/routes/guards/ProtectedRoute";
import { mapLazy } from "@/routes/route.helpers";
import { authService } from "@/services/auth.service";
import type { AppPermission } from "@/types/permission.types";

import {
  createBrowserRouter,
  redirect,
  type RouteObject,
} from "react-router-dom";

const protectedRouteConfigs: {
  permission?: AppPermission;
  routes: RouteObject[];
}[] = [
  { routes: dashboardRoutes },
  { permission: "prospect", routes: prospectRoutes },
  { permission: "customers", routes: customersRoutes },
  { permission: "analytics", routes: analyticsRoutes },
  { permission: "settings.users", routes: usersRoutes },
  { permission: "settings.profile", routes: profileRoutes },
  { permission: "settings.subscription", routes: subscriptionRoutes },
];

const protectedRoutes: RouteObject[] = protectedRouteConfigs.map(
  ({ permission, routes }) => ({
    element: <ProtectedRoute requiredPermission={permission} />,
    children: routes,
  }),
);

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: mapLazy(() => import("@/pages/Login.page")),
    handle: { title: "Login" },
    loader: () => {
      if (authService.getValidSession()) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/",
    Component: AppLayout,
    children: protectedRoutes,
  },
  {
    path: "*",
    lazy: mapLazy(() => import("@/pages/NotFound.page")),
    handle: { title: "Not Found" },
  },
]);

export default router;
