import type { User } from "@/types";

const USER_SEEDS = [
  [
    "USR-001",
    "Super Administrator",
    "admin@gmail.com",
    "admin",
    "role-superadmin",
  ],
  ["USR-002", "Standard User", "user@gmail.com", "user", "role-user"],
] as const;

export const MOCK_USERS: User[] = USER_SEEDS.map(
  ([id, name, email, password, roleId]) => ({
    id,
    name,
    email,
    password,
    roleId,
    status: "Active",
  }),
);
