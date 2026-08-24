import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      required = false,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `ech-input-${Math.random().toString(36).slice(2, 9)}`;

    const classes = [
      "ech-input-field",
      error ? "ech-input-field-error" : "",
      icon ? "ech-input-field-with-icon" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="ech-input-wrapper">
        {label && (
          <label htmlFor={inputId} className="ech-input-label">
            <span>{label}</span>

            {required && <span className="ech-input-required">*</span>}
          </label>
        )}

        <div className="ech-input-container">
          {icon && <span className="ech-input-icon">{icon}</span>}

          <input
            {...props}
            ref={ref}
            id={inputId}
            className={classes}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className="ech-input-error">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${inputId}-hint`} className="ech-input-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
