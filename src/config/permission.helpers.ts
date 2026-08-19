import type { MenuItem } from "@/config/menu.config";
import type { Permissions } from "@/types/permission.types";

// Mengambil nilai permission dari path bertingkat, misalnya "settings.users".
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

// Permission hanya valid jika nilai akhirnya benar-benar `true`.
export const hasPermission = (
  permissions: Permissions,
  permission: string,
): boolean => getPermissionValue(permissions, permission) === true;

// Membuat daftar menu sidebar yang sesuai dengan permission user tanpa mengubah `menuItems` asli.
export const getVisibleMenuItems = (
  menuItems: readonly MenuItem[],
  permissions: Permissions,
): MenuItem[] =>
  menuItems.flatMap((item) => {
    // Route dapat diakses, tetapi tidak perlu selalu ditampilkan di sidebar.
    if (item.hideInSidebar) return [];

    // Leaf menu hanya ditampilkan apabila user memiliki permission terkait.
    if (!item.children) {
      return !item.permission || hasPermission(permissions, item.permission)
        ? [item]
        : [];
    }

    // Filter child secara rekursif agar nested menu juga mengikuti permission.
    const children = getVisibleMenuItems(item.children, permissions);

    // Sembunyikan parent menu apabila seluruh child tidak dapat diakses.
    if (children.length === 0) return [];

    // Satu child tidak memerlukan dropdown; tampilkan sebagai link langsung.
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

    // Pertahankan parent dropdown bila ada beberapa child yang dapat diakses.
    return [{ ...item, children }];
  });
