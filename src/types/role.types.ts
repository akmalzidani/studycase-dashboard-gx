import type { Permissions } from "./permission.types";

export interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: Permissions;
}
