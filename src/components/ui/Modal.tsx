import {
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { X } from "lucide-react";

import "./Modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "small" | "medium" | "large";
  closeOnOverlay?: boolean;
}

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "medium",
  closeOnOverlay = true,
}: ModalProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const modalClass = [
    "ech-modal",
    `ech-modal-${size}`,
  ].join(" ");

  return (
    <div
      className="ech-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          closeOnOverlay &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ech-modal-title"
        aria-describedby={
          description
            ? "ech-modal-description"
            : undefined
        }
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="ech-modal-header">
          <div className="ech-modal-heading">
            <h2 id="ech-modal-title">
              {title}
            </h2>

            {description && (
              <p id="ech-modal-description">
                {description}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="ech-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={17} />
          </button>
        </div>

        {children && (
          <div className="ech-modal-body">
            {children}
          </div>
        )}

        {footer && (
          <div className="ech-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;