interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <span
      className={`
        inline-block
        animate-spin
        rounded-full
        border-2
        border-slate-300
        border-t-blue-600
        ${sizes[size]}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;
