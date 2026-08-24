import { Mail, Shield, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { FamilyMember, FamilyRole } from "../family.types";

interface EditFamilyMemberModalProps {
  member: FamilyMember | null;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
}

function EditFamilyMemberModal({
  member,
  onClose,
  onSave,
}: EditFamilyMemberModalProps) {
  const [displayName, setDisplayName] = useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] = useState<FamilyRole>("member");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!member) {
      return;
    }

    setDisplayName(member.displayName);

    setEmail(member.email);

    setRole(member.role);

    setError("");
  }, [member]);

  if (!member) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = displayName.trim();

    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter the family member's name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter an email address.");
      return;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    onSave({
      ...member,
      displayName: trimmedName,
      email: trimmedEmail,
      role,
    });
  };

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
        aria-labelledby="edit-family-member-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={19} />
            </div>

            <div>
              <h2
                id="edit-family-member-title"
                className="text-base font-semibold text-slate-900"
              >
                Edit family member
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Update this member's information.
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

        {/* FORM */}

        <form onSubmit={handleSubmit} className="p-5">
          {/* NAME */}

          <div>
            <label
              htmlFor="edit-family-member-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="edit-family-member-name"
                type="text"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* EMAIL */}

          <div className="mt-4">
            <label
              htmlFor="edit-family-member-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="edit-family-member-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* ROLE */}

          <div className="mt-4">
            <label
              htmlFor="edit-family-member-role"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Family role
            </label>

            <div className="relative">
              <Shield
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="edit-family-member-role"
                value={role}
                onChange={(event) => setRole(event.target.value as FamilyRole)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="member">Member</option>

                <option value="viewer">Viewer</option>

                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
            >
              {error}
            </div>
          )}

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
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <User size={16} />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFamilyMemberModal;
