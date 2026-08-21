import type { ReactNode } from "react";
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
  className: string;
  config?: DefaultRowAction<T>;
}

export function RowActions<T>({ item, actions }: RowActionsProps<T>) {
  const defaultActions: DefaultActionDefinition<T>[] = [
    {
      id: "detail",
      label: "Details",
      icon: <BsEye />,
      className: "btn btn-sm btn-secondary",
      config: actions.detail,
    },
    {
      id: "edit",
      label: "Edit",
      icon: <BsPencilSquare />,
      className: "btn btn-sm btn-primary",
      config: actions.edit,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <BsTrash />,
      className: "btn btn-sm btn-danger",
      config: actions.delete,
    },
  ];
  const children =
    typeof actions.children === "function"
      ? actions.children(item)
      : actions.children;

  return (
    <div className="d-flex justify-content-end gap-2">
      {defaultActions.map(({ id, label, icon, className, config }) =>
        config ? (
          <button
            key={id}
            type="button"
            className={className}
            aria-label={config.ariaLabel?.(item) ?? label}
            disabled={config.disabled}
            onClick={() => config.onClick(item)}
          >
            {icon}
          </button>
        ) : null,
      )}
      {children}
    </div>
  );
}
