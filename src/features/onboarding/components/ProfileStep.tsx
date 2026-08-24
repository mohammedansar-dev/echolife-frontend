import type { OnboardingData } from "../onboarding.types";

interface ProfileStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function ProfileStep({ data, onChange, onNext, onBack }: ProfileStepProps) {
  const canContinue = data.displayName.trim().length >= 2;

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-blue-600">Your profile</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Tell us a little about you.
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This information helps personalize your EchoLife experience.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="displayName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Display name
          </label>

          <input
            id="displayName"
            value={data.displayName}
            onChange={(event) =>
              onChange({
                displayName: event.target.value,
              })
            }
            placeholder="How should we call you?"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Preferred language
          </label>

          <select
            id="language"
            value={data.language}
            onChange={(event) =>
              onChange({
                language: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option>English</option>
            <option>Kannada</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Malayalam</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
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

export default ProfileStep;
