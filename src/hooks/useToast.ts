import { useCallback, useState } from "react";

import type { ToastItem } from "../components/feedback/ToastContainer";
import type { ToastType } from "../components/feedback/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3500) => {
      const id = Date.now() + Math.random();

      setToasts((current) => [
        ...current,
        {
          id,
          type,
          message,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  return {
    toasts,
    removeToast,
    showToast,
  };
}
