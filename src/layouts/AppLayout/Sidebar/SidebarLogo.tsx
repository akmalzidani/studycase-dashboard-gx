import { BsRocketTakeoffFill } from "react-icons/bs";

export function SidebarLogo({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="d-flex align-items-center justify-content-center p-3">
      <div
        className="d-flex align-items-center justify-content-center bg-white rounded-circle"
        style={{ width: "40px", height: "40px", flexShrink: 0 }}
      >
        <BsRocketTakeoffFill className="text-warning fs-4" />
      </div>
      {isOpen ? (
        <span className="fw-bold fs-5 text-truncate ms-2">LearnDash</span>
      ) : null}
    </div>
  );
}
