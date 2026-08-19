import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_ROLES } from "@/data/role.mock";
import { createLocalStorageCrudService } from "@/services/base-crud.service";
import type { Role } from "@/types";

export type RolePayload = Omit<Role, "id">;

export const roleService = createLocalStorageCrudService<Role>({
  storageKey: STORAGE_KEYS.ROLES,
  initialData: MOCK_ROLES,
  idPrefix: "ROLE",
  entityName: "Role",
  normalizePayload: (payload) => ({
    ...payload,
    name: payload.name.trim(),
    description: payload.description.trim(),
  }),
  getConflictMessage: (roles, payload, excludedId) =>
    roles.some(
      (role) =>
        role.id !== excludedId &&
        role.name.toLowerCase() === payload.name.toLowerCase(),
    )
      ? "Nama role sudah digunakan."
      : undefined,
});

export function getRoles(): Role[] {
  const storedRoles = localStorage.getItem(STORAGE_KEYS.ROLES);
  if (!storedRoles) return structuredClone(MOCK_ROLES);

  try {
    return JSON.parse(storedRoles) as Role[];
  } catch {
    return structuredClone(MOCK_ROLES);
  }
}
