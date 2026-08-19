import {
  createPermissions,
  PERMISSION_CATALOG,
  PERMISSION_KEYS,
} from "@/config/permission.config";
import type { Role } from "@/types";

const ALL_PERMISSION_KEYS = PERMISSION_CATALOG.map(
  (permission) => permission.key,
);

export const MOCK_ROLES: Role[] = [
  {
    id: "role-superadmin",
    name: "Super Administrator",
    description: "Akses penuh ke seluruh fitur dan pengaturan aplikasi.",
    permissions: createPermissions(ALL_PERMISSION_KEYS),
  },
  {
    id: "role-user",
    name: "Standard User",
    description: "Akses operasional dasar untuk customer dan prospect.",
    permissions: createPermissions([
      PERMISSION_KEYS.PROSPECT.CREATE,
      PERMISSION_KEYS.PROSPECT.READ,
      PERMISSION_KEYS.PROSPECT.UPDATE,
      PERMISSION_KEYS.CUSTOMERS.CREATE,
      PERMISSION_KEYS.CUSTOMERS.READ,
      PERMISSION_KEYS.CUSTOMERS.UPDATE,
      PERMISSION_KEYS.PROFILE.READ,
      PERMISSION_KEYS.PROFILE.UPDATE,
    ]),
  },
];
