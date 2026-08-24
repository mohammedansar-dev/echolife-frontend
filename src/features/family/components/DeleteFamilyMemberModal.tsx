import { AlertTriangle, Trash2, X } from "lucide-react";

import type { FamilyMember } from "../family.types";

interface DeleteFamilyMemberModalProps {
  member: FamilyMember | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteFamilyMemberModal({
  member,
  onClose,
  onConfirm,
}: DeleteFamilyMemberModalProps) {
  if (!member) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
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
        aria-labelledby="delete-family-member-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h2
                id="delete-family-member-title"
                className="text-base font-semibold text-slate-900"
              >
                Remove family member?
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="px-5 pb-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {member.displayName}
            </p>

            <p className="mt-1 text-xs text-slate-500">{member.email}</p>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Removing this person will disconnect them from your family space.
          </p>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 size={16} />
              Remove member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteFamilyMemberModal;
