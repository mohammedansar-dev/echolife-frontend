interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium">
        <span className="text-slate-500">
          Step {currentStep} of {totalSteps}
        </span>

        <span className="text-blue-600">{Math.round(progress)}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

export default OnboardingProgress;
