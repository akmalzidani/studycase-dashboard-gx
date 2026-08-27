import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.__isOpen);
  const theme = useThemeStore((state) => state.__theme);

  return (
    <aside
      className={`p-3 d-flex flex-column flex-shrink-0 sidebar sidebar--${theme} ${
        !isOpen ? "collapsed" : ""
      }`}
    >
      <SidebarLogo isOpen={isOpen} />
      <SidebarNav isOpen={isOpen} />
    </aside>
  );
}
