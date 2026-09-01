import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";

import AuthLayout from "../components/AuthLayout";
import Button from "../../../components/ui/Button";

import { useAuth } from "../AuthContext";

import { enrollMfa, confirmMfa } from "../auth.api";

import "./MFASetupPage.css";

function MFASetupPage() {
  const navigate = useNavigate();

  const { refreshCurrentUser } = useAuth();

  const [otpauthUri, setOtpauthUri] = useState("");

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [confirming, setConfirming] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  /* =======================================================
     START MFA ENROLLMENT
  ======================================================= */

  const handleStartEnrollment = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await enrollMfa();

      if (!response?.otpauthUri) {
        throw new Error(
          "MFA setup information was not returned by the server.",
        );
      }

      setOtpauthUri(response.otpauthUri);
    } catch (error: any) {
      console.error("EchoLife MFA enrollment failed:", error);

      const backendResponse = error?.response?.data;

      let message = "Unable to start MFA setup. Please try again.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (backendResponse?.message) {
        message = backendResponse.message;
      } else if (error?.message) {
        message = error.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CONFIRM MFA ENROLLMENT
  ======================================================= */

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCode = code.trim();

    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Enter the 6-digit verification code.");

      return;
    }

    setError("");
    setConfirming(true);

    try {
      /*
       * IMPORTANT:
       *
       * This is MFA ENROLLMENT.
       *
       * Therefore we call:
       *
       * POST /api/v1/auth/mfa/confirm
       *
       * We DO NOT call completeMfaLogin().
       */

      await confirmMfa(trimmedCode);

      /*
       * Ask backend for the latest user.
       *
       * This should now contain:
       *
       * mfaVerified: true
       *
       * AuthContext and localStorage are
       * updated immediately.
       */

      await refreshCurrentUser();

      setSuccess(true);
    } catch (error: any) {
      console.error("EchoLife MFA confirmation failed:", error);

      const backendResponse = error?.response?.data;

      let message = "The verification code is invalid or expired.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (backendResponse?.message) {
        message = backendResponse.message;
      } else if (error?.message) {
        message = error.message;
      }

      setError(message);
    } finally {
      setConfirming(false);
    }
  };

  /* =======================================================
     SUCCESS
  ======================================================= */

  if (success) {
    return (
      <main className="mfa-setup-page">
        <div className="mfa-setup-shell">
          <div className="mfa-setup-brand">
            <div className="mfa-setup-brand-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>EchoLife</strong>
              <span>Account security</span>
            </div>
          </div>

          <section className="mfa-setup-card mfa-success-card">
            <div className="mfa-success-icon">
              <CheckCircle2 size={31} />
            </div>

            <span className="mfa-setup-eyebrow">SECURITY SETUP COMPLETE</span>

            <h1>Two-factor authentication enabled</h1>

            <p>
              Your EchoLife account is now protected with an additional
              verification step.
            </p>

            <div className="mfa-success-box">
              <CheckCircle2 size={15} />

              <span>
                Your next login will require a verification code from your
                authenticator app.
              </span>
            </div>

            <Button
              type="button"
              fullWidth
              onClick={() =>
                navigate("/app/security", {
                  replace: true,
                })
              }
            >
              Return to Security
            </Button>
          </section>
        </div>
      </main>
    );
  }

  /* =======================================================
     SETUP PAGE
  ======================================================= */

  return (
    <main className="mfa-setup-page">
      <div className="mfa-setup-shell">
        {/* BRAND */}

        <div className="mfa-setup-brand">
          <div className="mfa-setup-brand-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>EchoLife</strong>
            <span>Account security</span>
          </div>
        </div>

        {/* CARD */}

        <section className="mfa-setup-card">
          {/* HEADER */}

          <div className="mfa-setup-icon">
            <Smartphone size={25} />
          </div>

          <span className="mfa-setup-eyebrow">TWO-FACTOR AUTHENTICATION</span>

          <h1>Set up MFA</h1>

          <p className="mfa-setup-description">
            Protect your EchoLife account with an authenticator app.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mfa-setup-error">
              <LockKeyhole size={15} />

              <span>{error}</span>
            </div>
          )}

          {/* BEFORE QR */}

          {!otpauthUri ? (
            <div className="mfa-setup-start">
              <div className="mfa-setup-info">
                <div className="mfa-setup-info-icon">
                  <Smartphone size={16} />
                </div>

                <div>
                  <strong>Use an authenticator app</strong>

                  <p>
                    Google Authenticator, Microsoft Authenticator, or another
                    TOTP-compatible authenticator app can be used.
                  </p>
                </div>
              </div>

              <div className="mfa-setup-steps">
                <div className="mfa-step">
                  <span>1</span>

                  <div>
                    <strong>Start MFA setup</strong>

                    <p>Generate your secure setup QR code.</p>
                  </div>
                </div>

                <div className="mfa-step">
                  <span>2</span>

                  <div>
                    <strong>Scan the QR code</strong>

                    <p>Open your authenticator and scan it.</p>
                  </div>
                </div>

                <div className="mfa-step">
                  <span>3</span>

                  <div>
                    <strong>Confirm your code</strong>

                    <p>Enter the 6-digit code generated by your app.</p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                fullWidth
                loading={loading}
                onClick={handleStartEnrollment}
              >
                <QrCode size={15} />
                Set up MFA
              </Button>
            </div>
          ) : (
            /* QR CODE */

            <div className="mfa-setup-qr-section">
              <div className="mfa-qr-heading">
                <span className="mfa-qr-step">STEP 1</span>

                <h2>Scan this QR code</h2>

                <p>Open your authenticator app and scan the code below.</p>
              </div>

              <div className="mfa-qr-container">
                <div className="mfa-qr">
                  <QRCodeSVG value={otpauthUri} size={210} level="M" />
                </div>
              </div>

              <div className="mfa-qr-instruction">
                <Smartphone size={14} />

                <span>
                  After scanning, your authenticator app will generate a new
                  6-digit code.
                </span>
              </div>

              <form onSubmit={handleConfirm} className="mfa-confirm-form">
                <div className="mfa-confirm-step">
                  <span>STEP 2</span>

                  <label htmlFor="mfa-setup-code">
                    Enter your authenticator code
                  </label>
                </div>

                <input
                  id="mfa-setup-code"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  className="mfa-setup-code-input"
                />

                <p className="mfa-code-help">
                  Enter the current 6-digit code displayed in your authenticator
                  app.
                </p>

                <Button type="submit" fullWidth loading={confirming}>
                  <CheckCircle2 size={15} />
                  Confirm and enable MFA
                </Button>
              </form>
            </div>
          )}

          {/* FOOTER */}

          <div className="mfa-setup-footer">
            <Link to="/app/security">
              <ArrowLeft size={13} />
              Back to Security
            </Link>
          </div>
        </section>

        {/* TRUST */}

        <div className="mfa-setup-trust">
          <LockKeyhole size={12} />

          <span>
            Your security settings are private to your EchoLife account.
          </span>
        </div>
      </div>
    </main>
  );
}

export default MFASetupPage;
