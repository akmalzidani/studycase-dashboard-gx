import type { RouteObject } from "react-router-dom";
import { generateRoutes } from "@/routes/route.helpers";
import { APP_PATHS } from "@/config/paths.config";

export const customersRoutes: RouteObject[] = [
  generateRoutes({
    basePath: APP_PATHS.CUSTOMERS.ROOT,
    title: "Customers",
    components: {
      List: () => import("@/pages/Customers.page"),
    },
  }),
];
