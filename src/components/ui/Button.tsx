import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "ech-button",
    `ech-button-${variant}`,
    `ech-button-${size}`,
    fullWidth ? "ech-button-full" : "",
    loading ? "ech-button-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} className={classes} disabled={disabled || loading}>
      {loading ? (
        <span className="ech-button-spinner" aria-hidden="true" />
      ) : (
        icon && <span className="ech-button-icon">{icon}</span>
      )}

      <span className="ech-button-content">
        {loading ? "Please wait..." : children}
      </span>
    </button>
  );
}

export default Button;
