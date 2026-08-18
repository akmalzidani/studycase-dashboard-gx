import { APP_PATHS } from "@/config/paths.config";
import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const subscriptionRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.SETTINGS.SUBSCRIPTION.ROOT,
    title: "Subscription",
    components: {
      List: () => import("@/pages/Subscription.page"),
    },
  }),
];
