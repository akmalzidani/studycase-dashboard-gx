import { useThemeStore } from "@/stores/useThemeStore";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

export function SidebarThemeSwitch({ isOpen }: { isOpen: boolean }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="sidebar__theme-switch pt-3 border-top">
      {isOpen ? (
        /* Mode Expanded*/
        <div className="d-flex align-items-center justify-content-between px-2">
          <div className="sidebar__theme-label d-flex align-items-center gap-2 opacity-90">
            {theme === "dark" ? <BsMoonStarsFill /> : <BsSunFill />}
            <span className="small fw-medium">Dark Mode</span>
          </div>
          <div className="form-check form-switch m-0 p-0 d-flex align-items-center">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="darkModeSwitch"
              checked={theme === "dark"}
              onChange={toggleTheme}
              title="Toggle Dark Mode"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      ) : (
        /* Mode Collapsed */
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-link sidebar__theme-button hover-bg-light p-2 d-flex align-items-center justify-content-center text-decoration-none rounded"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <BsSunFill className="fs-5" />
            ) : (
              <BsMoonStarsFill className="fs-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
