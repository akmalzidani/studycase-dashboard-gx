import { usePageTitle } from "@/hooks/usePageTitle";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { HeaderProfileDropdown } from "./HeaderProfileDropdown";
import { BsList } from "react-icons/bs";

function Header() {
  const currentTitle = usePageTitle();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const theme = useThemeStore((state) => state.theme);

  return (
    <header className="px-4 py-3 bg-body border-bottom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className={`btn hover-bg-light border-0 p-1 px-2 ${theme === "dark" ? "text-white" : "text-dark"}`}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <BsList className="fs-4" />
        </button>
        <h5 className="mb-0 fw-bold">{currentTitle}</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <HeaderProfileDropdown />
      </div>
    </header>
  );
}

export default Header;
