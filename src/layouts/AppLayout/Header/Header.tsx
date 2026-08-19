import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { BsList } from "react-icons/bs";
import { HeaderProfileDropdown } from "./HeaderProfileDropdown";

function Header() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const theme = useThemeStore((state) => state.theme);

  return (
    <header className="sticky-top z-1 px-4 py-3 bg-body border-bottom d-flex align-items-center justify-content-between">
      <button
        type="button"
        className={`btn hover-bg-light border-0 p-1 px-2 ${theme === "dark" ? "text-white" : "text-dark"}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <BsList className="fs-4" />
      </button>
      <HeaderProfileDropdown />
    </header>
  );
}

export default Header;
