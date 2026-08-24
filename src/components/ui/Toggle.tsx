import { forwardRef, type InputHTMLAttributes } from "react";

import "./Toggle.css";

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  description?: string;
  error?: string;
  toggleSize?: "small" | "medium";
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      error,
      toggleSize = "medium",
      id = "ech-toggle",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={["ech-toggle-wrapper", className].filter(Boolean).join(" ")}
      >
        <label htmlFor={id} className="ech-toggle-label">
          {(label || description) && (
            <span className="ech-toggle-content">
              {label && <span className="ech-toggle-title">{label}</span>}

              {description && (
                <span className="ech-toggle-description">{description}</span>
              )}
            </span>
          )}

          <span
            className={["ech-toggle-control", `ech-toggle-${toggleSize}`].join(
              " ",
            )}
          >
            <input
              {...props}
              ref={ref}
              id={id}
              type="checkbox"
              className="ech-toggle-input"
              aria-invalid={error ? true : undefined}
            />

            <span className="ech-toggle-track">
              <span className="ech-toggle-thumb" />
            </span>
          </span>
        </label>

        {error && <p className="ech-toggle-error">{error}</p>}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
