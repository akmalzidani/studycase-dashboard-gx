import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BsList } from "react-icons/bs";
import { HeaderProfileDropdown } from "./HeaderProfileDropdown";

function Header() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const theme = useThemeStore((state) => state.theme);
  const pageTitle = usePageTitle();

  return (
    <header className="sticky-top z-1 px-4 py-3 bg-body border-bottom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className={`btn hover-bg-light border-0 p-1 px-2 ${theme === "dark" ? "text-white" : "text-dark"}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <BsList className="fs-4" />
        </button>
        <h1 className="h5 mb-0 fw-semibold">{pageTitle}</h1>
      </div>
      <HeaderProfileDropdown />
    </header>
  );
}

export default Header;
