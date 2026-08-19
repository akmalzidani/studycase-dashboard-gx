import { menuConfig } from "@/config/menu.config";
import { getVisibleMenuItems } from "@/config/permission.helpers";
import { useAuthStore } from "@/stores/useAuthStore";
import { SidebarNavItem } from "./SidebarNavItem";

export function SidebarNav({ isOpen }: { isOpen: boolean }) {
  const { permissions } = useAuthStore();

  const visibleMenuItems = getVisibleMenuItems(menuConfig, permissions);

  return (
    <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
      {visibleMenuItems.map((item) => (
        <SidebarNavItem key={item.id} item={item} isOpen={isOpen} />
      ))}
    </nav>
  );
}
