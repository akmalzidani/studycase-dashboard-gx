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
  dashboard: true,
  prospect: true,
  customers: true,
  analytics: false,
  settings: {
    users: false,
    profile: true,
    subscription: false,
  },
};

export const MOCK_USERS: User[] = [
  {
    id: "USR-001",
    name: "Super Administrator",
    email: "admin@gmail.com",
    password: "admin",
    role: "superadmin",
    permission: SUPERADMIN_PERMISSIONS,
  },
  {
    id: "USR-002",
    name: "Standard User",
    email: "user@gmail.com",
    password: "user",
    role: "user",
    permission: USER_PERMISSIONS,
  },
];
