import { APP_PATHS } from "@/config/paths.config";
import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const profileRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.SETTINGS.PROFILE.ROOT,
    title: "Profile",
    idParam: "none",
    components: {
      List: () => import("@/pages/Profile.page"),
    },
  }),
];
