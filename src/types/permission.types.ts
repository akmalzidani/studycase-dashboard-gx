export interface Permissions {
  [key: string]: boolean | Permissions;
}

export type PermissionKey =
  | "dashboard"
  | "prospect"
  | "customers"
  | "analytics"
  | "productMarketing"
  | "settings.users"
  | "settings.profile"
  | "settings.subscription";

export type AppPermission = PermissionKey;
