import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              E
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              Echo<span className="text-blue-600">Life</span>
            </span>
          </div>

          <span className="text-xs font-medium text-slate-400">
            Setup your space
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <OnboardingProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

import OnboardingProgress from "./OnboardingProgress";

export default OnboardingLayout;
