import type { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const classes = ["ech-empty-state", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {icon && <div className="ech-empty-state-icon">{icon}</div>}

      <h3 className="ech-empty-state-title">{title}</h3>

      {description && (
        <p className="ech-empty-state-description">{description}</p>
      )}

      {action && <div className="ech-empty-state-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
