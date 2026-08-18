import type { ComponentPropsWithoutRef } from "react";

export type SkeletonProps = ComponentPropsWithoutRef<"div">;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return <div className={`skeleton ${className}`.trim()} {...props} />;
}
