import { Sparkles } from "lucide-react";

import type { OnboardingData } from "../onboarding.types";

interface PersonaStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const relationships = [
  "Father",
  "Mother",
  "Grandparent",
  "Spouse",
  "Sibling",
  "Friend",
  "Other",
];

const languages = [
  "English",
  "Kannada",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
];

const tones = ["Warm", "Calm", "Friendly", "Caring", "Thoughtful"];

function PersonaStep({ data, onChange, onNext, onBack }: PersonaStepProps) {
  const persona = data.persona;

  const updatePersona = (updates: Partial<typeof persona>) => {
    onChange({
      persona: {
        ...persona,
        ...updates,
      },
    });
  };

  const canContinue =
    persona.name.trim().length >= 2 && persona.relationship.trim().length > 0;

  return (
    <div>
      {/* Header */}
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles size={21} />
        </div>

        <p className="mt-5 text-sm font-semibold text-blue-600">AI Persona</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Create your memory companion.
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Give your persona a name and personality. You can change these
          settings later.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-5">
        {/* Persona name */}
        <div>
          <label
            htmlFor="persona-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Persona name
          </label>

          <input
            id="persona-name"
            value={persona.name}
            onChange={(event) =>
              updatePersona({
                name: event.target.value,
              })
            }
            placeholder="For example, Appa"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Relationship */}
        <div>
          <label
            htmlFor="persona-relationship"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Relationship
          </label>

          <select
            id="persona-relationship"
            value={persona.relationship}
            onChange={(event) =>
              updatePersona({
                relationship: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select relationship</option>

            {relationships.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
        </div>

        {/* Language + tone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="persona-language"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Language
            </label>

            <select
              id="persona-language"
              value={persona.language}
              onChange={(event) =>
                updatePersona({
                  language: event.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="persona-tone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tone
            </label>

            <select
              id="persona-tone"
              value={persona.tone}
              onChange={(event) =>
                updatePersona({
                  tone: event.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      {persona.name.trim() && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Preview
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-700 shadow-sm">
              {persona.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {persona.name}
              </p>

              <p className="text-xs text-slate-500">
                {persona.relationship || "Choose a relationship"} ·{" "}
                {persona.tone}
              </p>
            </div>
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

        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default PersonaStep;
