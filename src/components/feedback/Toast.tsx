import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const config = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
  },
  error: {
    icon: TriangleAlert,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
};

function Toast({ type, message, onClose }: ToastProps) {
  const item = config[type];
  const Icon = item.icon;

  return (
    <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bgClass}`}
      >
        <Icon size={18} className={item.iconClass} />
      </div>

      <p className="flex-1 pt-1 text-sm font-medium text-slate-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default Toast;
