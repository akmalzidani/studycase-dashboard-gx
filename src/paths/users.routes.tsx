import { APP_PATHS } from "@/config/paths.config";
import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const usersRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.SETTINGS.USERS.ROOT,
    title: "Users",
    components: {
      List: () => import("@/pages/Users.page"),
    },
  }),
];
