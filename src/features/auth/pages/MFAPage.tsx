import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import Button from "../../../components/ui/Button";

import { useAuth } from "../AuthContext";

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

    if (!/^\d{6}$/.test(code)) {
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
      /*
       * This performs:
       *
       * POST /api/v1/auth/mfa/verify
       *
       * and then updates AuthContext.user.
       */
      await completeMfaLogin(state.mfaToken, code);

      /*
       * AuthContext is now authenticated.
       */
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

  return (
    <AuthLayout
      title="Verify your identity"
      description={`Enter the verification code from your authenticator app for ${
        state?.email ?? "your account"
      }.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="mfa-code"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Verification code
          </label>

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
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          Verify code
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default MFAPage;
