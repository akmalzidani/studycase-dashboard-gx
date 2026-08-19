import type { User, Permissions } from "@/types";

const SUPERADMIN_PERMISSIONS: Permissions = {
  dashboard: true,
  prospect: true,
  customers: true,
  analytics: true,
  settings: {
    users: true,
    profile: true,
    subscription: true,
  },
};

const USER_PERMISSIONS: Permissions = {
  ...SUPERADMIN_PERMISSIONS,
  analytics: false,
  settings: {
    ...(SUPERADMIN_PERMISSIONS.settings as Permissions),
    users: false,
    subscription: false,
  },
};

const USER_SEEDS = [
  [
    "USR-001",
    "Super Administrator",
    "admin@gmail.com",
    "admin",
    "superadmin",
    SUPERADMIN_PERMISSIONS,
  ],
  [
    "USR-002",
    "Standard User",
    "user@gmail.com",
    "user",
    "user",
    USER_PERMISSIONS,
  ],
] as const;

export const MOCK_USERS: User[] = USER_SEEDS.map(
  ([id, name, email, password, role, permission]) => ({
    id,
    name,
    email,
    password,
    role,
    permission,
  }),
);
