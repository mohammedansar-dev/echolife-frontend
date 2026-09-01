import { useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { verifyMfa } from "../auth.api";

import type { LoginResponse } from "../auth.types";

interface MFALocationState {
  mfaToken?: string;
  email?: string;
}

function MFAPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const state = location.state as MFALocationState | null;

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const mfaToken = state?.mfaToken;

  const email = state?.email;

  /* =========================================================
     SAFETY CHECK
     ========================================================= */

  if (!mfaToken) {
    return (
      <AuthLayout
        title="MFA verification"
        description="Your verification session is missing or has expired."
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            We couldn't find a valid MFA verification session.
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
        </div>
      </AuthLayout>
    );
  }

  /* =========================================================
     VERIFY MFA
     ========================================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("Please enter your verification code.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response: LoginResponse = await verifyMfa(mfaToken, trimmedCode);

      if (!response.accessToken) {
        throw new Error(
          "MFA verification succeeded, but the backend did not return an access token.",
        );
      }

      /*
       * Store JWT.
       */

      localStorage.setItem("echolife_auth_token", response.accessToken);

      /*
       * Ask the backend for the authenticated user.
       */

      const { getCurrentUser } = await import("../auth.api");

      const currentUser = await getCurrentUser();

      const user = {
        id: currentUser.userId,
        email: currentUser.email,
        displayName: currentUser.name,
        role: currentUser.role,
        status: currentUser.active ? "active" : "inactive",
        mfaVerified: currentUser.mfaVerified,
        active: currentUser.active,
      };

      localStorage.setItem("echolife_auth_user", JSON.stringify(user));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error("EchoLife MFA verification failed:", err);

      const backendResponse = err?.response?.data;

      let message = "Verification failed. Please check the code and try again.";

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (backendResponse?.message) {
        message = backendResponse.message;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your identity"
      description={
        email
          ? `Enter the verification code for ${email}.`
          : "Enter the verification code to continue."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          id="mfa-code"
          label="Verification code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter 6-digit code"
          maxLength={6}
          value={code}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "");

            setCode(value);
          }}
        />

        <p className="text-xs leading-5 text-slate-500">
          Enter the 6-digit code from your authenticator app.
        </p>

        <Button type="submit" fullWidth loading={isSubmitting}>
          Verify and continue
        </Button>

        <button
          type="button"
          onClick={() =>
            navigate("/login", {
              replace: true,
            })
          }
          className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Back to sign in
        </button>
      </form>
    </AuthLayout>
  );
}

export default MFAPage;
