import { useEffect, useRef } from "react";
import {
  initializeTooltip,
  setTooltipContent,
} from "@/helpers/tooltip.helpers";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BsList, BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { HeaderProfileDropdown } from "./HeaderProfileDropdown";

function Header() {
  const { __handleToggleSidebar: _handleToggleSidebar } = useSidebarStore();
  const { __isDarkMode: isDarkMode, __handleToggleTheme: _handleToggleTheme } =
    useThemeStore();
  const pageTitle = usePageTitle();
  const nextTheme = isDarkMode ? "light" : "dark";
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => initializeTooltip(sidebarToggleRef.current), []);

  useEffect(() => initializeTooltip(themeToggleRef.current), []);

  useEffect(() => {
    setTooltipContent(themeToggleRef.current, `Switch to ${nextTheme} mode`);
  }, [nextTheme]);

  return (
    <header className="sticky-top z-3 px-4 py-3 bg-body border-bottom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className={`btn hover-bg-light border-0 p-1 px-2 ${isDarkMode ? "text-white" : "text-dark"}`}
          ref={sidebarToggleRef}
          onClick={_handleToggleSidebar}
          aria-label="Toggle sidebar"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="Toggle sidebar"
        >
          <BsList className="fs-4" />
        </button>
        <h1 className="h5 mb-0 fw-semibold">{pageTitle}</h1>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn hover-bg-light border-0 p-1 px-2"
          ref={themeToggleRef}
          onClick={_handleToggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          aria-pressed={isDarkMode}
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title={`Switch to ${nextTheme} mode`}
        >
          {isDarkMode ? (
            <BsSunFill className="fs-5" />
          ) : (
            <BsMoonStarsFill className="fs-5" />
          )}
        </button>
        <HeaderProfileDropdown />
      </div>
    </header>
  );
}

export default Header;
