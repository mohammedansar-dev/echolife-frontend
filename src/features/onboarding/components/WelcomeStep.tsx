import { ArrowRight, Heart, ShieldCheck, Sparkles } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Heart size={30} />
      </div>

      <p className="mt-6 text-sm font-semibold text-blue-600">
        Welcome to EchoLife
      </p>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Preserve what matters most.
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
        Let's take a few minutes to personalize your EchoLife space and prepare
        it for your family's memories.
      </p>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <ShieldCheck size={20} className="text-blue-600" />

          <p className="mt-3 text-sm font-semibold text-slate-800">Private</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Your memories stay under your control.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <Heart size={20} className="text-blue-600" />

          <p className="mt-3 text-sm font-semibold text-slate-800">Personal</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Build a space around your family.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <Sparkles size={20} className="text-blue-600" />

          <p className="mt-3 text-sm font-semibold text-slate-800">
            Meaningful
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Turn memories into lasting connections.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        Get started
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

export default WelcomeStep;
