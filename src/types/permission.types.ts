import { MENU_SCHEMA } from "@/config/menu.config";

export interface Permissions {
  [key: string]: boolean | Permissions;
}

export type AppPermission = PermissionKey<typeof MENU_SCHEMA>;

export type PermissionKey<T> = {
  [K in keyof T & string]: T[K] extends { children: infer Children }
    ? `${K}.${PermissionKey<Children>}`
    : K;
}[keyof T & string];
