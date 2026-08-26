import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import AuthLayout from "../components/AuthLayout";
import Button from "../../../components/ui/Button";

import { enrollMfa, confirmMfa } from "../auth.api";

function MFASetupPage() {
  const navigate = useNavigate();

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

      setOtpauthUri(response.otpauthUri);
    } catch (error: any) {
      console.error("EchoLife MFA enrollment failed:", error);

      const backendResponse = error?.response?.data;

      let message = "Unable to start MFA setup. Please try again.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (
        backendResponse &&
        typeof backendResponse.message === "string"
      ) {
        message = backendResponse.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CONFIRM MFA
     ======================================================= */

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setError("");
    setConfirming(true);

    try {
      await confirmMfa(code);

      setSuccess(true);
    } catch (error: any) {
      console.error("EchoLife MFA confirmation failed:", error);

      const backendResponse = error?.response?.data;

      let message = "The verification code is invalid or expired.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (
        backendResponse &&
        typeof backendResponse.message === "string"
      ) {
        message = backendResponse.message;
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
      <AuthLayout
        title="Two-factor authentication enabled"
        description="Your EchoLife account is now protected with MFA."
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-4 text-sm leading-6 text-green-700">
            MFA has been successfully enabled for your account. Your next login
            will require a verification code.
          </div>

          <Button
            type="button"
            fullWidth
            onClick={() => navigate("/app/dashboard", { replace: true })}
          >
            Return to dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <AuthLayout
      title="Set up two-factor authentication"
      description="Add an extra layer of security to your EchoLife account."
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {!otpauthUri ? (
          <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Use an authenticator app such as Google Authenticator, Microsoft
              Authenticator, or another TOTP-compatible authenticator.
            </div>

            <Button
              type="button"
              fullWidth
              loading={loading}
              onClick={handleStartEnrollment}
            >
              Set up MFA
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-sm leading-6 text-slate-600">
                Scan this QR code with your authenticator app.
              </p>

              <div className="mt-5 flex justify-center rounded-2xl border border-slate-200 bg-white p-6">
                <QRCodeSVG value={otpauthUri} size={220} level="M" />
              </div>
            </div>

            <form onSubmit={handleConfirm} className="space-y-5">
              <div>
                <label
                  htmlFor="mfa-setup-code"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Authenticator code
                </label>

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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <Button type="submit" fullWidth loading={confirming}>
                Confirm and enable MFA
              </Button>
            </form>
          </>
        )}

        <div className="text-center">
          <Link
            to="/app/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default MFASetupPage;
