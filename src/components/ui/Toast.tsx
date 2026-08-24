import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import "./Toast.css";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  message: ReactNode;
  variant?: ToastVariant;
  title?: string;
  onClose: () => void;
  duration?: number;
}

function Toast({
  open,
  message,
  variant = "success",
  title,
  onClose,
}: ToastProps) {
  if (!open) {
    return null;
  }

  const Icon =
    variant === "success"
      ? CheckCircle2
      : variant === "error"
        ? XCircle
        : variant === "warning"
          ? TriangleAlert
          : Info;

  return (
    <div
      className={`ech-toast ech-toast-${variant}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <div className="ech-toast-icon">
        <Icon size={17} />
      </div>

      <div className="ech-toast-content">
        {title && <strong>{title}</strong>}

        <span>{message}</span>
      </div>

      <button
        type="button"
        className="ech-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
