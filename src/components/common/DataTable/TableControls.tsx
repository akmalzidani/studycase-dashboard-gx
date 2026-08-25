import type { ReactNode } from "react";
import { BsSearch } from "react-icons/bs";

export interface TableControlsProps {
  showSearch?: boolean;
  search: string;
  actions: {
    handleSearch: (search: string) => void;
  };
  children?: ReactNode;
}

export function TableControls({
  showSearch,
  search,
  actions,
  children,
}: TableControlsProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
      {showSearch ? (
        <div className="d-flex align-items-center">
          <div className="input-group input-group-sm">
            <span className="input-group-text border-end-0">
              <BsSearch className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-start-0"
              placeholder="Search..."
              value={search}

              onChange={(event) => actions.handleSearch(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      {children ? (
        <div className="d-flex align-items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
