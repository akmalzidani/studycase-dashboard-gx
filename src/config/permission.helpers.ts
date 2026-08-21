import type { MenuItem } from "@/config/menu.config";
import type { Permissions } from "@/types/permission.types";

// Retrieves a permission value from a nested path, such as "settings.users".
const getPermissionValue = (
  permissions: Permissions,
  permission: string,
): unknown =>
  permission
    .split(".")
    .reduce<unknown>(
      (current, key) => (current as Record<string, unknown>)?.[key],
      permissions,
    );

// A permission is valid only when its final value is explicitly `true`.
export const hasPermission = (
  permissions: Permissions,
  permission: string,
): boolean => getPermissionValue(permissions, permission) === true;

// Builds a sidebar menu list that matches user permissions without mutating the original `menuItems`.
export const getVisibleMenuItems = (
  menuItems: readonly MenuItem[],
  permissions: Permissions,
): MenuItem[] =>
  menuItems.flatMap((item) => {
    // The route is accessible but does not always need to appear in the sidebar.
    if (item.hideInSidebar) return [];

    // A leaf menu is displayed only when the user has the related permission.
    if (!item.children) {
      return !item.permission || hasPermission(permissions, item.permission)
        ? [item]
        : [];
    }

    // Filter children recursively so nested menus also follow permissions.
    const children = getVisibleMenuItems(item.children, permissions);

    // Hide a parent menu when none of its children are accessible.
    if (children.length === 0) return [];

    // A single child does not need a dropdown; show it as a direct link.
    if (children.length === 1) {
      const [child] = children;
      return [
        {
          ...item,
          id: child.id,
          label: child.label,
          path: child.path,
          permission: child.permission,
          children: undefined,
        },
      ];
    }

    // Retain the parent dropdown when multiple children are accessible.
    return [{ ...item, children }];
  });
