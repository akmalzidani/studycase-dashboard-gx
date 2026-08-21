import type { Column } from "@/components/common/DataTable";
import type { ManagedUser } from "@/components/UserManagement/types";

export const userTableColumns: Column<ManagedUser>[] = [
  {
    key: "name",
    header: "Name",
    sortKey: "name",
    render: (user) => <span className="fw-semibold">{user.name}</span>,
  },
  { key: "email", header: "Email", sortKey: "email" },
  { key: "roleName", header: "Role", render: (user) => user.roleName ?? "-" },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <span
        className={`badge text-bg-${user.status === "Inactive" ? "secondary" : "success"}`}
      >
        {user.status === "Inactive" ? "Inactive" : "Active"}
      </span>
    ),
  },
];
