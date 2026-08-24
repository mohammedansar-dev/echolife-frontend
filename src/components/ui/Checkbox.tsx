import { forwardRef, type InputHTMLAttributes } from "react";

import { Check } from "lucide-react";

import "./Checkbox.css";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, id, className = "", ...props }, ref) => {
    const checkboxId = id || "ech-checkbox";

    return (
      <div className={`ech-checkbox-wrapper ${className}`}>
        <label htmlFor={checkboxId} className="ech-checkbox-label">
          <span className="ech-checkbox-control">
            <input
              {...props}
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className="ech-checkbox-input"
              aria-invalid={error ? true : undefined}
            />

            <span className="ech-checkbox-box">
              <Check size={13} strokeWidth={2.5} />
            </span>
          </span>

          <span className="ech-checkbox-content">
            <span className="ech-checkbox-title">{label}</span>

            {description && (
              <span className="ech-checkbox-description">{description}</span>
            )}
          </span>
        </label>

        {error && <p className="ech-checkbox-error">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
