import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import Button from "../../../components/ui/Button";

import { useAuth } from "../AuthContext";

import "./MFAPage.css";

interface MFAState {
  email?: string;
  mfaToken?: string;
}

function MFAPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { completeMfaLogin } = useAuth();

  const state = location.state as MFAState | null;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedCode = code.trim();

    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (!state?.mfaToken) {
      setError("Your MFA session is missing or expired. Please sign in again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await completeMfaLogin(state.mfaToken, trimmedCode);

      navigate("/app/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error("EchoLife MFA verification failed:", error);

      const backendResponse = error?.response?.data;

      let message = "The verification code is invalid or expired.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (
        backendResponse &&
        typeof backendResponse.message === "string"
      ) {
        message = backendResponse.message;
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * Missing MFA session
   */

  if (!state?.mfaToken) {
    return (
      <main className="mfa-page">
        <div className="mfa-shell">
          <section className="mfa-card mfa-error-card">
            <div className="mfa-brand-mark">
              <ShieldCheck size={22} />
            </div>

            <span className="mfa-eyebrow">ACCOUNT SECURITY</span>

            <h1>MFA verification unavailable</h1>

            <p className="mfa-description">
              Your verification session is missing or has expired. Please sign
              in again to continue.
            </p>

            <div className="mfa-error-box">
              <LockKeyhole size={16} />

              <span>We couldn't find a valid MFA verification session.</span>
            </div>

            <Button
              type="button"
              fullWidth
              onClick={() =>
                navigate("/login", {
                  replace: true,
                })
              }
            >
              Return to sign in
            </Button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mfa-page">
      <div className="mfa-shell">
        {/* HEADER */}

        <div className="mfa-top-brand">
          <div className="mfa-brand-mark">
            <ShieldCheck size={21} />
          </div>

          <div>
            <strong>EchoLife</strong>
            <span>Private family space</span>
          </div>
        </div>

        {/* CARD */}

        <section className="mfa-card">
          {/* ICON */}

          <div className="mfa-icon-wrapper">
            <div className="mfa-main-icon">
              <Smartphone size={25} />
            </div>

            <div className="mfa-icon-check">
              <CheckCircle2 size={13} />
            </div>
          </div>

          {/* TITLE */}

          <div className="mfa-heading">
            <span className="mfa-eyebrow">TWO-FACTOR AUTHENTICATION</span>

            <h1>Verify your identity</h1>

            <p>
              Enter the 6-digit verification code from your authenticator app to
              continue.
            </p>
          </div>

          {/* ACCOUNT */}

          {state.email && (
            <div className="mfa-account">
              <div className="mfa-account-icon">
                <LockKeyhole size={14} />
              </div>

              <div>
                <span>Signing in as</span>
                <strong>{state.email}</strong>
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mfa-error-box">
              <LockKeyhole size={16} />

              <span>{error}</span>
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit} className="mfa-form">
            <div className="mfa-field">
              <label htmlFor="mfa-code">Verification code</label>

              <input
                id="mfa-code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                autoFocus
                className="mfa-code-input"
              />

              <span className="mfa-field-help">
                Enter the current 6-digit code shown in your authenticator app.
              </span>
            </div>

            <Button type="submit" fullWidth loading={isSubmitting}>
              Verify and continue
            </Button>
          </form>

          {/* FOOTER */}

          <div className="mfa-footer">
            <Link to="/login">
              <ArrowLeft size={13} />
              Back to sign in
            </Link>
          </div>
        </section>

        {/* TRUST NOTE */}

        <div className="mfa-trust">
          <LockKeyhole size={12} />

          <span>Your verification is securely processed by EchoLife.</span>
        </div>
      </div>
    </main>
  );
}

export default MFAPage;
