interface SpinnerProps {
  size?: "sm";
  className?: string;
  label?: string;
}

export function Spinner({ size, className = "", label }: SpinnerProps) {
  const spinnerClassName = [
    "spinner-border",
    size === "sm" && "spinner-border-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return label ? (
    <span className={spinnerClassName} role="status">
      <span className="visually-hidden">{label}</span>
    </span>
  ) : (
    <span className={spinnerClassName} aria-hidden="true" />
  );
}
