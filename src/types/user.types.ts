export type UserStatus = "Active" | "Inactive";

export interface User {
  id?: string;
  email: string;
  password?: string;
  name: string;
  roleId: string;
  status: UserStatus;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}
