import Spinner from "../ui/Spinner";

interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <Spinner size="lg" />

      <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export default LoadingState;
