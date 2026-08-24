import type { ReactNode } from "react";

import "./FormField.css";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

function FormField({
  children,
  className = "",
  fullWidth = true,
}: FormFieldProps) {
  const classes = [
    "ech-form-field",
    fullWidth ? "ech-form-field-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

export default FormField;
