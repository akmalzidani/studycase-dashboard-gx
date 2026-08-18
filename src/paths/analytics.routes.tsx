import { APP_PATHS } from "@/config/paths.config";
import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const analyticsRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.ANALYTICS.ROOT,
    title: "Analytics",
    components: {
      List: () => import("@/pages/Analytics.page"),
    },
  }),
];
