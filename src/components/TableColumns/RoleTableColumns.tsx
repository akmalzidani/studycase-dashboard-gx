import type { Column } from "@/components/common/DataTable";
import type { Permissions, Role } from "@/types";

function countPermissions(permissions: Permissions): number {
  return Object.values(permissions).reduce<number>(
    (total, value) =>
      total +
      (typeof value === "object" ? countPermissions(value) : Number(value)),
    0,
  );
}

export const roleTableColumns: Column<Role>[] = [
  {
    key: "name",
    header: "Nama role",
    sortKey: "name",
    render: (role) => <span className="fw-semibold">{role.name}</span>,
  },
  { key: "description", header: "Deskripsi", sortKey: "description" },
  {
    key: "permissions",
    header: "Jumlah akses",
    render: (role) => `${countPermissions(role.permissions)} permission`,
  },
];
