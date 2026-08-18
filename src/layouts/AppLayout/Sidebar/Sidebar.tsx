import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";
import { SidebarThemeSwitch } from "./SidebarThemeSwitch";

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const theme = useThemeStore((state) => state.theme);

  return (
    <aside
      className={`p-3 d-flex flex-column sidebar sidebar--${theme} ${
        !isOpen ? "collapsed" : ""
      }`}
    >
      <SidebarLogo isOpen={isOpen} />
      <SidebarNav isOpen={isOpen} />
      <SidebarThemeSwitch isOpen={isOpen} />
    </aside>
  );
}
