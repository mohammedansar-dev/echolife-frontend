import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState } from "react";

import type { Memory } from "../memory.types";

interface DeleteMemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
  onConfirm: (memoryId: string) => void;
}

function DeleteMemoryModal({
  memory,
  onClose,
  onConfirm,
}: DeleteMemoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!memory) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    onConfirm(memory.id);

    setIsDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-memory-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
            aria-label="Close delete confirmation"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="delete-memory-title"
          className="mt-5 text-lg font-semibold text-slate-900"
        >
          Delete this memory?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You're about to delete{" "}
          <span className="font-semibold text-slate-700">"{memory.title}"</span>
          . This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}

            {isDeleting ? "Deleting..." : "Delete memory"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMemoryModal;
