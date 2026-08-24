import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

import type { FamilyMember, OnboardingData } from "../onboarding.types";

interface FamilyStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const relationships = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grandparent",
  "Spouse",
  "Child",
  "Friend",
  "Other",
];

function FamilyStep({ data, onChange, onNext, onBack }: FamilyStepProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Father");
  const [email, setEmail] = useState("");

  const addMember = () => {
    if (!name.trim()) return;

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      relationship,
      email: email.trim() || undefined,
    };

    onChange({
      familyMembers: [...data.familyMembers, newMember],
    });

    setName("");
    setRelationship("Father");
    setEmail("");
  };

  const removeMember = (id: string) => {
    onChange({
      familyMembers: data.familyMembers.filter((member) => member.id !== id),
    });
  };

  return (
    <div>
      {/* Header */}
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Users size={21} />
        </div>

        <p className="mt-5 text-sm font-semibold text-blue-600">Your family</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Who should be part of your EchoLife space?
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add family members who will share memories and be part of your family
          space. You can always add people later.
        </p>
      </div>

      {/* Add member form */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800">
          Add a family member
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label
              htmlFor="family-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="family-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter their name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Relationship */}
          <div>
            <label
              htmlFor="family-relationship"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Relationship
            </label>

            <select
              id="family-relationship"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {relationships.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label
              htmlFor="family-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
              <span className="ml-1 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <input
              id="family-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="family@example.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addMember}
          disabled={!name.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
          Add family member
        </button>
      </div>

      {/* Added members */}
      {data.familyMembers.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Added family members
            </h2>

            <span className="text-xs font-medium text-slate-400">
              {data.familyMembers.length}{" "}
              {data.familyMembers.length === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="space-y-2">
            {data.familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {member.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {member.relationship}

                    {member.email && (
                      <>
                        {" · "}
                        {member.email}
                      </>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Back
        </button>

        <div className="flex items-center gap-2">
          {/* Skip */}
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default FamilyStep;
