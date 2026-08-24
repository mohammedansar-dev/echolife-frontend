import type { ReactNode } from "react";

import "./Card.css";

interface CardProps {
  children: ReactNode;

  title?: string;
  description?: string;

  action?: ReactNode;

  padding?: "small" | "medium" | "large";

  className?: string;

  onClick?: () => void;
}

function Card({
  children,
  title,
  description,
  action,
  padding = "medium",
  className = "",
  onClick,
}: CardProps) {
  const cardClassName = [
    "ech-card",
    `ech-card-${padding}`,
    onClick ? "ech-card-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={cardClassName}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {(title || description || action) && (
        <header className="ech-card-header">
          <div className="ech-card-heading">
            {title && <h2 className="ech-card-title">{title}</h2>}

            {description && (
              <p className="ech-card-description">{description}</p>
            )}
          </div>

          {action && <div className="ech-card-action">{action}</div>}
        </header>
      )}

      <div className="ech-card-body">{children}</div>
    </section>
  );
}

export default Card;
