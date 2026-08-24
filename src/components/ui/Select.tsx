import { forwardRef, type SelectHTMLAttributes } from "react";

import { ChevronDown } from "lucide-react";

import "./Select.css";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      required = false,
      options,
      placeholder,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || "ech-select";

    const classes = [
      "ech-select-field",
      error ? "ech-select-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="ech-select-wrapper">
        {label && (
          <label htmlFor={selectId} className="ech-select-label">
            {label}

            {required && <span className="ech-select-required">*</span>}
          </label>
        )}

        <div className="ech-select-container">
          <select
            {...props}
            ref={ref}
            id={selectId}
            className={classes}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="ech-select-arrow"
            size={15}
            aria-hidden="true"
          />
        </div>

        {error && (
          <p id={`${selectId}-error`} className="ech-select-error-message">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${selectId}-hint`} className="ech-select-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
