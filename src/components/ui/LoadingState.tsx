import { LoaderCircle } from "lucide-react";

import "./LoadingState.css";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  size?: "small" | "medium" | "large";
}

function LoadingState({
  message = "Loading...",
  fullPage = false,
  size = "medium",
}: LoadingStateProps) {
  const classes = [
    "ech-loading",
    `ech-loading-${size}`,
    fullPage ? "ech-loading-full-page" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <LoaderCircle className="ech-loading-spinner" aria-hidden="true" />

      {message && <span className="ech-loading-message">{message}</span>}
    </div>
  );
}

export default LoadingState;
