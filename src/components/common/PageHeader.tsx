import { hasPermission } from "@/config/permission.helpers";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ReactNode } from "react";

export interface PageHeaderAction {
  id: string;
  content: ReactNode;
  permission?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: PageHeaderAction[];
}

export function PageHeader({
  title,
  description,
  actions = [],
}: PageHeaderProps) {
  const permissions = useAuthStore((store) => store.__permissions);
  const visibleActions = actions.filter(
    (action) =>
      !action.permission || hasPermission(permissions, action.permission),
  );

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h1 className="h3 mb-1 fw-bold">{title}</h1>
        <p className="text-muted mb-0">{description}</p>
      </div>
      {visibleActions.length > 0 ? (
        <div className="d-flex gap-2">
          {visibleActions.map((action) => (
            <span key={action.id}>{action.content}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
