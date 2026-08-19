import type { User } from "@/types";

export type ManagedUser = User & {
  roleName?: string;
};

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  roleId: string;
  status: "Active" | "Inactive";
}
