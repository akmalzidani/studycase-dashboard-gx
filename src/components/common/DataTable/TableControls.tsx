import type { ReactNode } from "react";
import { BsSearch } from "react-icons/bs";

export interface TableControlsProps {
  showSearch?: boolean;
  search: string;
  setSearch: (search: string) => void;
  actions?: ReactNode;
}

export function TableControls({
  showSearch,
  search,
  setSearch,
  actions,
}: TableControlsProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
      {showSearch && (
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

              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
    </div>
  );
}
