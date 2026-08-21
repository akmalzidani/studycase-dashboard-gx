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
  colorClassName: string;
  config?: DefaultRowAction<T>;
}

const ACTION_BUTTON_CLASS_NAME = "btn btn-sm border-0 bg-transparent p-0";

export function RowActions<T>({ item, actions }: RowActionsProps<T>) {
  const defaultActions: DefaultActionDefinition<T>[] = [
    {
      id: "detail",
      label: "Details",
      icon: <BsEye />,
      colorClassName: "text-secondary",
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
    <div className="d-flex justify-content-end gap-2">
      {defaultActions.map(({ id, label, icon, colorClassName, config }) =>
        config ? (
          <button
            key={id}
            type="button"
            className={`${ACTION_BUTTON_CLASS_NAME} ${colorClassName}`}
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
