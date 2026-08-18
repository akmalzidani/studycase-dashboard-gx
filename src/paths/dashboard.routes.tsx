import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  generateRoutes({
    basePath: "",
    title: "Dashboard",
    components: {
      List: () => import("@/pages/Dashboard.page"),
    },
  }),
];
