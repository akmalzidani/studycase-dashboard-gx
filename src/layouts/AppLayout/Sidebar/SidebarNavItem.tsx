import { type MenuItem } from "@/config/menu.config";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BsChevronUp, BsChevronDown, BsCircleFill } from "react-icons/bs";

export function SidebarNavItem({
  item,
  isOpen,
}: {
  item: MenuItem;
  isOpen: boolean;
}) {
  const { pathname } = useLocation();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const hasChildren: boolean = (item.children?.length ?? 0) > 0;

  const isChildActive: boolean = hasChildren
    ? item.children!.some(
        (child) => child.path && pathname.startsWith(child.path),
      )
    : false;

  const [isExpanded, setIsExpanded] = useState<boolean>(isChildActive);

  // Auto-expand if a child active
  useEffect(() => {
    if (isChildActive) setIsExpanded(true);
  }, [isChildActive]);

  const baseNavClass = `nav-link sidebar__nav-link hover-opacity d-flex align-items-center gap-2 py-2 rounded ${
    !isOpen ? "justify-content-center px-0" : "px-3"
  }`;
  const activeClass = "sidebar__nav-link--active fw-semibold opacity-100";
  const inactiveClass = "opacity-75";

  function navLinkClass({ isActive }: { isActive: boolean }) {
    return `${baseNavClass} ${isActive ? activeClass : inactiveClass}`;
  }

  if (!hasChildren) {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path || "#"}
        title={!isOpen ? item.label : undefined}
        className={navLinkClass}
      >
        {Icon && <Icon className="fs-5" />}
        {isOpen && <span className="text-truncate">{item.label}</span>}
      </NavLink>
    );
  }

  const Icon = item.icon;

  return (
    <>
      {/* Parent Menu */}
      <div
        role="button"
        title={!isOpen ? item.label : undefined}
        className={`${baseNavClass} ${
          isChildActive ? "opacity-100 fw-semibold" : inactiveClass
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (isOpen) {
            setIsExpanded(!isExpanded);
          } else {
            toggleSidebar();
            setIsExpanded(true);
          }
        }}
      >
        {Icon && <Icon className="fs-5" />}
        {isOpen && (
          <>
            <span className="text-truncate flex-grow-1">{item.label}</span>
            {isExpanded ? (
              <BsChevronUp
                className="small"
                style={{ transition: "transform 0.2s" }}
              />
            ) : (
              <BsChevronDown
                className="small"
                style={{ transition: "transform 0.2s" }}
              />
            )}
          </>
        )}
      </div>

      {/* Dropdown Item */}
      {isOpen && isExpanded && (
        <div className="ps-4 pe-2 pt-1 pb-1 d-flex flex-column gap-1">
          {item.children!.map((child) => {
            const ChildIcon = child.icon;
            return (
              <NavLink
                key={child.id}
                to={child.path || "#"}
                className={navLinkClass}
              >
                {ChildIcon ? (
                  <ChildIcon className="fs-6" />
                ) : (
                  <BsCircleFill style={{ fontSize: "6px" }} />
                )}
                <span className="text-truncate small">{child.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
}
