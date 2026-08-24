import { forwardRef, type TextareaHTMLAttributes } from "react";

import "./Textarea.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      required = false,
      maxLength,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || "ech-textarea";

    const classes = [
      "ech-textarea-field",
      error ? "ech-textarea-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="ech-textarea-wrapper">
        {label && (
          <label htmlFor={textareaId} className="ech-textarea-label">
            <span>{label}</span>

            {required && <span className="ech-textarea-required">*</span>}
          </label>
        )}

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          className={classes}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
        />

        <div className="ech-textarea-footer">
          {error ? (
            <p
              id={`${textareaId}-error`}
              className="ech-textarea-error-message"
            >
              {error}
            </p>
          ) : hint ? (
            <p id={`${textareaId}-hint`} className="ech-textarea-hint">
              {hint}
            </p>
          ) : (
            <span />
          )}

          {maxLength && (
            <span className="ech-textarea-counter">
              Maximum {maxLength} characters
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
