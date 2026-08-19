import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { getRoles } from "@/services/role.service";
import { toast, confirm } from "@/components/Overlay";
import { APP_PATHS } from "@/config/paths.config";

import { authService } from "@/services/auth.service";
import { BsPersonCircle, BsPerson, BsBoxArrowRight } from "react-icons/bs";

export function HeaderProfileDropdown() {
  const { user, checkSession } = useAuthStore();
  const roleName =
    getRoles().find((role) => role.id === user?.roleId)?.name ?? "User";

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.logout();
      checkSession();
      toast.info("Successfully logged out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogout = () => {
    confirm({
      title: "Logout",
      message: "Apakah Anda yakin ingin keluar dari akun ini?",
      confirmText: "Logout",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: () => logout(),
    });
  };

  return (
    <div className="dropdown">
      <div
        className="hover-bg-light p-1 px-2 rounded d-flex align-items-center gap-2 user-select-none dropdown-toggle"
        style={{ cursor: "pointer" }}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        role="button"
      >
        <span className="d-none d-sm-block text-end lh-sm">
          <span className="d-block small fw-semibold text-muted">
            {user?.name || "User"}
          </span>
          <span className="d-block small text-muted text-capitalize">
            {roleName}
          </span>
        </span>
        <BsPersonCircle className="fs-4" />
      </div>

      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
        <li>
          <NavLink
            to={`/${APP_PATHS.SETTINGS.PROFILE.ROOT}`}
            className={({ isActive }) =>
              `dropdown-item d-flex align-items-center gap-2 ${isActive && "active"}`
            }
          >
            <BsPerson /> Profile
          </NavLink>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item text-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
            ) : (
              <BsBoxArrowRight />
            )}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
}
