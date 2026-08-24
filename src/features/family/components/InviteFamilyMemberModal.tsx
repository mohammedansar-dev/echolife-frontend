import { Mail, Send, Shield, UserPlus, X } from "lucide-react";
import { useState } from "react";

import type { FamilyInvitation, FamilyRole } from "../family.types";

interface InviteFamilyMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (invitation: FamilyInvitation) => void;
  invitedBy: string;
}

function InviteFamilyMemberModal({
  open,
  onClose,
  onInvite,
  invitedBy,
}: InviteFamilyMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<FamilyRole>("member");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address.");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    const now = new Date();

    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const invitation: FamilyInvitation = {
      id: crypto.randomUUID(),

      email: normalizedEmail,

      role,

      message: message.trim() || undefined,

      invitedBy,

      createdAt: now.toISOString(),

      expiresAt: expiresAt.toISOString(),

      status: "pending",

      token: crypto.randomUUID(),
    };

    onInvite(invitation);

    setEmail("");
    setRole("member");
    setMessage("");
    setError("");
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
        aria-labelledby="invite-family-member-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus size={19} />
            </div>

            <div>
              <h2
                id="invite-family-member-title"
                className="text-base font-semibold text-slate-900"
              >
                Invite family member
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Send an invitation to join your family space.
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
          {/* EMAIL */}

          <div>
            <label
              htmlFor="family-invite-email"
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
                id="family-invite-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="family@example.com"
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* ROLE */}

          <div className="mt-4">
            <label
              htmlFor="family-invite-role"
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
                id="family-invite-role"
                value={role}
                onChange={(event) => setRole(event.target.value as FamilyRole)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="member">Member</option>

                <option value="viewer">Viewer</option>

                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* MESSAGE */}

          <div className="mt-4">
            <label
              htmlFor="family-invite-message"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Message
              <span className="ml-1 font-normal text-slate-400">Optional</span>
            </label>

            <textarea
              id="family-invite-message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setError("");
              }}
              rows={3}
              maxLength={300}
              placeholder="I'd like you to join our EchoLife family space..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-right text-[11px] text-slate-400">
              {message.length}/300
            </p>
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

          {/* INFO */}

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">
            <p className="text-xs leading-5 text-blue-700">
              Invitations are valid for 7 days. You can resend or cancel pending
              invitations from the Family page.
            </p>
          </div>

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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send size={16} />
              Send invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteFamilyMemberModal;
