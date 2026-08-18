import type { Permissions } from "./permission.types";

export type Role = "superadmin" | "user";

export interface User {
  id?: string;
  email: string;
  password?: string;
  name: string;
  role: Role;
  permission: Permissions;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}
