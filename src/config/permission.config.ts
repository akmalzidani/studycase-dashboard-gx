import type { Permissions } from "@/types";

const ACTION_LABELS = {
  create: "Tambah",
  read: "Lihat",
  update: "Ubah",
  delete: "Hapus",
} as const;

type PermissionAction = keyof typeof ACTION_LABELS;

type PermissionGroup<
  TPrefix extends string,
  TActions extends readonly PermissionAction[],
> = {
  feature: string;
  prefix: TPrefix;
  actions: TActions;
};

const definePermissionGroup = <
  const TPrefix extends string,
  const TActions extends readonly PermissionAction[],
>(
  feature: string,
  prefix: TPrefix,
  actions: TActions,
): PermissionGroup<TPrefix, TActions> => ({ feature, prefix, actions });

export const PERMISSION_CONFIG = {
  PROSPECT: definePermissionGroup("Prospect", "prospect", [
    "create",
    "read",
    "update",
    "delete",
  ]),
  CUSTOMERS: definePermissionGroup("Customer", "customers", [
    "create",
    "read",
    "update",
    "delete",
  ]),
  ANALYTICS: definePermissionGroup("Analytics", "analytics", ["read"]),
  USERS: definePermissionGroup("User", "settings.users", [
    "create",
    "read",
    "update",
    "delete",
  ]),
  ROLES: definePermissionGroup("Role", "settings.roles", [
    "create",
    "read",
    "update",
    "delete",
  ]),
  PERMISSIONS: definePermissionGroup("Permission", "settings.permissions", [
    "read",
  ]),
  PROFILE: definePermissionGroup("Profile", "settings.profile", [
    "read",
    "update",
  ]),
  SUBSCRIPTION: definePermissionGroup("Subscription", "settings.subscription", [
    "create",
    "read",
    "update",
    "delete",
  ]),
} as const;

type PermissionKeys<
  TGroup extends PermissionGroup<string, readonly PermissionAction[]>,
> = {
  [
    TAction in TGroup["actions"][number] as Uppercase<TAction>
  ]: `${TGroup["prefix"]}.${TAction}`;
};

const createPermissionKeys = <
  const TGroup extends PermissionGroup<string, readonly PermissionAction[]>,
>(
  group: TGroup,
): PermissionKeys<TGroup> =>
  Object.fromEntries(
    group.actions.map((action) => [
      action.toUpperCase(),
      `${group.prefix}.${action}`,
    ]),
  ) as PermissionKeys<TGroup>;

export const PERMISSION_KEYS = {
  PROSPECT: createPermissionKeys(PERMISSION_CONFIG.PROSPECT),
  CUSTOMERS: createPermissionKeys(PERMISSION_CONFIG.CUSTOMERS),
  ANALYTICS: createPermissionKeys(PERMISSION_CONFIG.ANALYTICS),
  USERS: createPermissionKeys(PERMISSION_CONFIG.USERS),
  ROLES: createPermissionKeys(PERMISSION_CONFIG.ROLES),
  PERMISSIONS: createPermissionKeys(PERMISSION_CONFIG.PERMISSIONS),
  PROFILE: createPermissionKeys(PERMISSION_CONFIG.PROFILE),
  SUBSCRIPTION: createPermissionKeys(PERMISSION_CONFIG.SUBSCRIPTION),
} as const;

export const PERMISSION_CATALOG = Object.values(PERMISSION_CONFIG).flatMap(
  ({ feature, prefix, actions }) =>
    actions.map((action) => ({
      key: `${prefix}.${action}`,
      feature,
      action,
      label: ACTION_LABELS[action],
    })),
);

export const createPermissions = (keys: readonly string[]): Permissions =>
  keys.reduce<Permissions>((permissions, key) => {
    const parts = key.split(".");
    let current = permissions;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = true;
        return;
      }

      current[part] ??= {};
      current = current[part] as Permissions;
    });

    return permissions;
  }, {});
