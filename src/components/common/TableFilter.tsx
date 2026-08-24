import { Dropdown as BootstrapDropdown } from "bootstrap";
import { useEffect, useId, useRef } from "react";
import { BsFunnel, BsXCircle } from "react-icons/bs";

export interface TableFilterOption {
  value: string;
  label: string;
}

export interface TableFilterField {
  key: string;
  label: string;
  options: readonly TableFilterOption[];
  disabled?: boolean;
}

interface TableFilterProps {
  fields: readonly TableFilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  ariaLabel?: string;
}

export function TableFilter({
  fields,
  values,
  onChange,
  onReset,
  ariaLabel = "Filter table",
}: TableFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const hasActiveFilters = Object.values(values).some(Boolean);

  useEffect(() => {
    const dropdownElement = dropdownRef.current;
    if (!dropdownElement) return;

    const dropdown = BootstrapDropdown.getOrCreateInstance(dropdownElement);
    return () => dropdown.dispose();
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown">
      <button
        type="button"
        className={`btn btn-sm btn-outline-primary position-relative ${
          hasActiveFilters ? "active" : ""
        }`}
        aria-label={ariaLabel}
        title={ariaLabel}
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      >
        <BsFunnel aria-hidden="true" />
        {hasActiveFilters ? (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle">
            <span className="visually-hidden">Active filters</span>
          </span>
        ) : null}
      </button>

      <div
        className="dropdown-menu dropdown-menu-end p-3 shadow"
        style={{ minWidth: "240px" }}
      >
        <div className="d-grid gap-3">
          {fields.map((field) => {
            const inputId = `${idPrefix}-${field.key}`;
            return (
              <div key={field.key}>
                <label
                  className="form-label small fw-semibold mb-1"
                  htmlFor={inputId}
                >
                  {field.label}
                </label>
                <select
                  id={inputId}
                  className="form-select form-select-sm"
                  value={values[field.key] ?? ""}
                  disabled={field.disabled}
                  onChange={(event) => onChange(field.key, event.target.value)}
                >
                  <option value="">All {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <footer className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-link btn-sm mt-3 p-0 text-decoration-none"
            disabled={!hasActiveFilters}
            onClick={onReset}
          >
            <BsXCircle className="me-1" aria-hidden="true" />
            Reset filters
          </button>
        </footer>
      </div>
    </div>
  );
}
