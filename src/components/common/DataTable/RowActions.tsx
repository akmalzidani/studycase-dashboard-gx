import { Tooltip } from "bootstrap";
import { useEffect, useRef, type ReactNode } from "react";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import type { DefaultRowAction, RowActionsConfig } from "./types";

interface RowActionsProps<T> {
  item: T;
  actions: RowActionsConfig<T>;
}

interface DefaultActionDefinition<T> {
  id: string;
  label: string;
  icon: ReactNode;
  colorClassName: string;
  config?: DefaultRowAction<T>;
}

const ACTION_BUTTON_CLASS_NAME = "btn btn-sm border-0 bg-transparent p-0";

export function RowActions<T>({ item, actions }: RowActionsProps<T>) {
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actionButtons =
      actionsRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-bs-toggle="tooltip"]',
      );
    if (!actionButtons) return;

    const tooltips = Array.from(actionButtons, (button) => new Tooltip(button));
    return () => tooltips.forEach((tooltip) => tooltip.dispose());
  });

  const defaultActions: DefaultActionDefinition<T>[] = [
    {
      id: "detail",
      label: "Details",
      icon: <BsEye />,
      colorClassName: "text-body-secondary",
      config: actions.detail,
    },
    {
      id: "edit",
      label: "Edit",
      icon: <BsPencilSquare />,
      colorClassName: "text-primary",
      config: actions.edit,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <BsTrash />,
      colorClassName: "text-danger",
      config: actions.delete,
    },
  ];
  const children =
    typeof actions.children === "function"
      ? actions.children(item)
      : actions.children;

  return (
    <div ref={actionsRef} className="d-flex justify-content-end gap-2">
      {defaultActions.map(({ id, label, icon, colorClassName, config }) => {
        const ariaLabel = config?.ariaLabel?.(item) ?? label;

        return config ? (
          <button
            key={id}
            type="button"
            className={`${ACTION_BUTTON_CLASS_NAME} ${colorClassName}`}
            aria-label={ariaLabel}
            data-bs-toggle="tooltip"
            data-bs-title={ariaLabel}
            disabled={config.disabled}
            onClick={() => config.handleClick(item)}
          >
            {icon}
          </button>
        ) : null;
      })}
      {children}
    </div>
  );
}
