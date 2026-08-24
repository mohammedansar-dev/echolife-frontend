import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CompleteStep() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <CheckCircle2 size={32} />
      </div>

      <p className="mt-6 text-sm font-semibold text-green-600">
        Setup complete
      </p>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Your EchoLife space is ready.
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
        Your profile, family setup, AI Persona, privacy preferences, and first
        memory are ready to begin your EchoLife journey.
      </p>

      <div className="mx-auto mt-7 max-w-md rounded-2xl bg-slate-50 p-4 text-left">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />

          <span className="text-sm text-slate-700">Profile configured</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />

          <span className="text-sm text-slate-700">
            Family space configured
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />

          <span className="text-sm text-slate-700">AI Persona configured</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-green-600" />

          <span className="text-sm text-slate-700">
            Privacy preferences confirmed
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate("/app/dashboard", {
            replace: true,
          })
        }
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        Go to dashboard
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

export default CompleteStep;
