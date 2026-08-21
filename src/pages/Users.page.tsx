import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { PermissionTab } from "@/components/UserManagement/PermissionTab";
import { RoleTab } from "@/components/UserManagement/RoleTab";
import { UserTab } from "@/components/UserManagement/UserTab";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ComponentType } from "react";

interface UserManagementTab {
  id: string;
  label: string;
  Component: ComponentType;
  permission: string;
}

const tabs: UserManagementTab[] = [
  {
    id: "users",
    label: "User",
    Component: UserTab,
    permission: PERMISSION_KEYS.USERS.READ,
  },
  {
    id: "roles",
    label: "Role",
    Component: RoleTab,
    permission: PERMISSION_KEYS.ROLES.READ,
  },
  {
    id: "permissions",
    label: "Permission",
    Component: PermissionTab,
    permission: PERMISSION_KEYS.PERMISSIONS.READ,
  },
];

export default function UsersPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const visibleTabs = tabs.filter((tab) =>
    hasPermission(permissions, tab.permission),
  );

  return (
    <>
      <ul
        className="nav nav-tabs user-management-tabs mb-4"
        id="user-management-tabs"
        role="tablist"
      >
        {visibleTabs.map(({ id, label }, index) => (
          <li key={id} className="nav-item" role="presentation">
            <button
              className={`nav-link ${index === 0 ? "active" : ""}`}
              data-bs-toggle="tab"
              data-bs-target={`#${id}-tab`}
              type="button"
              role="tab"
              aria-controls={`${id}-tab`}
              aria-selected={index === 0}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {visibleTabs.map(({ id, Component }, index) => (
          <div
            key={id}
            className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
            id={`${id}-tab`}
            role="tabpanel"
          >
            <Component />
          </div>
        ))}
      </div>
    </>
  );
}
