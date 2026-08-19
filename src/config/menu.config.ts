import { formatMenuLabel } from "@/config/menu.helpers";
import type { IconType } from "react-icons";
import {
  BsBarChart,
  BsBuilding,
  BsGear,
  BsGrid,
  BsPeople,
} from "react-icons/bs";
import { APP_PATHS } from "./paths.config";

export interface MenuItem {
  id: string;
  permission?: string;
  label: string;
  path?: string;
  icon?: IconType;
  hideInSidebar?: boolean;
  children?: MenuItem[];
}

type MenuSchema = Record<
  string,
  {
    path?: string;
    icon?: IconType;
    children?: MenuSchema;
    hideInSidebar?: boolean;
    requiresPermission?: boolean;
  }
>;

export const MENU_SCHEMA = {
  dashboard: {
    path: APP_PATHS.DASHBOARD.INDEX,
    icon: BsGrid,
    requiresPermission: false,
  },
  prospect: { path: APP_PATHS.PROSPECT.INDEX, icon: BsPeople },
  customers: { path: APP_PATHS.CUSTOMERS.INDEX, icon: BsBuilding },
  analytics: { path: APP_PATHS.ANALYTICS.INDEX, icon: BsBarChart },
  settings: {
    icon: BsGear,
    children: {
      users: { path: APP_PATHS.SETTINGS.USERS.INDEX },
      profile: { path: APP_PATHS.SETTINGS.PROFILE.INDEX },
      subscription: { path: APP_PATHS.SETTINGS.SUBSCRIPTION.INDEX },
    },
  },
} as const satisfies MenuSchema;

const generateMenu = (
  schema: MenuSchema,
  parentPermission?: string,
): MenuItem[] =>
  Object.entries(schema).map(([key, value]) => {
    const permission = [parentPermission, key].filter(Boolean).join(".");

    return {
      id: permission,
      permission:
        value.children || value.requiresPermission === false
          ? undefined
          : `${permission}.read`,
      label: formatMenuLabel(key),
      path: value.path,
      icon: value.icon,
      hideInSidebar: value.hideInSidebar ?? false,
      children: value.children
        ? generateMenu(value.children, permission)
        : undefined,
    };
  });

export const menuConfig: MenuItem[] = generateMenu(MENU_SCHEMA);
