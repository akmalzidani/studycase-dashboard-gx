import { APP_PATHS } from "@/config/paths.config";
import { generateRoutes } from "@/routes/route.helpers";
import type { RouteObject } from "react-router-dom";

export const productMarketingRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.PRODUCT_MARKETING.ROOT,
    title: "Product Marketing",
    components: {
      List: () => import("@/pages/ProductMarketing.page"),
    },
  }),
];
