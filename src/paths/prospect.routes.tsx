import type { RouteObject } from "react-router-dom";
import { generateRoutes } from "@/routes/route.helpers";
import { APP_PATHS } from "@/config/paths.config";

export const prospectRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.PROSPECT.ROOT,
    title: "Prospect",
    components: {
      List: () => import("@/pages/Prospect.page"),
    },
  }),
];
