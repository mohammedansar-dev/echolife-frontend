import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

interface DeleteFamilyModalProps {
  open: boolean;

  familyName: string;

  onClose: () => void;

  onConfirm: () => void;
}

function DeleteFamilyModal({
  open,
  familyName,
  onClose,
  onConfirm,
}: DeleteFamilyModalProps) {
  const [confirmation, setConfirmation] = useState("");

  if (!open) {
    return null;
  }

  const canDelete = confirmation.trim().toLowerCase() === "delete";

  const handleConfirm = () => {
    if (!canDelete) {
      return;
    }

    onConfirm();

    setConfirmation("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-family-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2
                id="delete-family-title"
                className="text-base font-semibold text-slate-900"
              >
                Delete family space
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm leading-6 text-red-700">
              You are about to delete <strong>{familyName}</strong>. This will
              remove the family space and its local family data from this
              device.
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="delete-family-confirmation"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Type <span className="font-bold text-red-600">delete</span> to
              confirm
            </label>

            <input
              id="delete-family-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="delete"
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setConfirmation("");
                onClose();
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canDelete}
              onClick={handleConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={16} />
              Delete family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteFamilyModal;
