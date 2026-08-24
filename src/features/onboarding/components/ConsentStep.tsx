import { Check, LockKeyhole, ShieldCheck } from "lucide-react";

import type { OnboardingData } from "../onboarding.types";

interface ConsentStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function ConsentStep({ data, onChange, onNext, onBack }: ConsentStepProps) {
  const allRequiredAccepted =
    data.consentTerms &&
    data.consentMemoryProcessing &&
    data.consentAiInteraction;

  return (
    <div>
      {/* Header */}
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ShieldCheck size={21} />
        </div>

        <p className="mt-5 text-sm font-semibold text-blue-600">
          Privacy & consent
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Your memories stay yours.
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Before you continue, review how EchoLife handles your memories and AI
          Persona.
        </p>
      </div>

      {/* Privacy summary */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
            <LockKeyhole size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Your privacy matters
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              EchoLife is designed to keep your personal memories private and
              give you control over how they are used.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">
              Private memories
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Your uploaded memories belong to your EchoLife space.
            </p>
          </div>

          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">Your control</p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              You can manage or remove your memories later.
            </p>
          </div>

          <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">
              AI boundaries
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              AI interactions use memories according to your configured
              permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Consent options */}
      <div className="mt-6 space-y-3">
        {/* Terms */}
        <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <input
            type="checkbox"
            checked={data.consentTerms}
            onChange={(event) =>
              onChange({
                consentTerms: event.target.checked,
              })
            }
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              I agree to the EchoLife Terms.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              I understand the terms that apply to my use of the EchoLife
              service.
            </p>
          </div>
        </label>

        {/* Memory processing */}
        <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <input
            type="checkbox"
            checked={data.consentMemoryProcessing}
            onChange={(event) =>
              onChange({
                consentMemoryProcessing: event.target.checked,
              })
            }
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              I understand how my memories are stored and processed.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              I understand that EchoLife needs to process uploaded content to
              provide memory storage and related features.
            </p>
          </div>
        </label>

        {/* AI */}
        <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
          <input
            type="checkbox"
            checked={data.consentAiInteraction}
            onChange={(event) =>
              onChange({
                consentAiInteraction: event.target.checked,
              })
            }
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              I understand that AI Persona interactions may use approved
              memories.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              I understand that memories made available to the AI Persona may be
              used to provide personalized responses.
            </p>
          </div>
        </label>
      </div>

      {/* Status */}
      <div
        className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          allRequiredAccepted
            ? "bg-green-50 text-green-700"
            : "bg-slate-50 text-slate-500"
        }`}
      >
        <Check size={16} />

        {allRequiredAccepted
          ? "All required consents have been accepted."
          : "Please review and accept all required items to continue."}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!allRequiredAccepted}
          onClick={onNext}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default ConsentStep;
