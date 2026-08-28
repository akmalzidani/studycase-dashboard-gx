import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectFieldProps {
  id: string;
  label: string;
  options: readonly MultiSelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function MultiSelectField({
  id,
  label,
  options,
  selectedIds,
  onChange,
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id),
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  const toggleOption = (optionId: number) =>
    onChange(
      selectedIds.includes(optionId)
        ? selectedIds.filter((selectedId) => selectedId !== optionId)
        : [...selectedIds, optionId],
    );

  return (
    <div ref={fieldRef} className="multi-select-field position-relative">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        className="multi-select-trigger form-select text-start d-flex flex-wrap align-items-center gap-1 pe-5"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
      >
        {selectedOptions.length ? (
          selectedOptions.map((option) => (
            <span
              key={option.id}
              className="multi-select-chip badge text-bg-yellow-100 d-inline-flex align-items-center gap-1"
            >
              {option.name}
              <span
                role="button"
                tabIndex={0}
                className="btn-close"
                aria-label={`Remove ${option.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleOption(option.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleOption(option.id);
                  }
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-muted">Select {label.toLowerCase()}</span>
        )}
      </button>

      {isOpen ? (
        <div
          className="dropdown-menu show w-100 mt-1 p-2 shadow"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const optionId = `${id}-${option.id}`;

            return (
              <label
                key={option.id}
                className={`dropdown-item d-flex align-items-center gap-2 rounded ${
                  isSelected ? "multi-select-option-selected bg-yellow-100" : ""
                }`}
                role="option"
                aria-selected={isSelected}
                htmlFor={optionId}
              >
                <input
                  id={optionId}
                  type="checkbox"
                  className="form-check-input m-0 flex-shrink-0"
                  checked={isSelected}
                  onChange={() => toggleOption(option.id)}
                />
                <span>{option.name}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
