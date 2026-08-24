import type { ReactNode } from "react";
import "./Badge.css";

type BadgeVariant = "blue" | "success" | "warning" | "danger" | "neutral";

type BadgeSize = "small" | "medium";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

function Badge({
  children,
  variant = "neutral",
  size = "medium",
  dot = false,
  className = "",
}: BadgeProps) {
  const classes = [
    "ech-badge",
    `ech-badge-${variant}`,
    `ech-badge-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && <span className="ech-badge-dot" aria-hidden="true" />}

      {children}
    </span>
  );
}

export default Badge;
