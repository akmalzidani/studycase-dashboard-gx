import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "secondary",
  className = "",
}: BadgeProps) {
  return <span className={`badge text-bg-${variant} ${className}`.trim()}>{children}</span>;
}
