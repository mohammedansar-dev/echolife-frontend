import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "./AuthLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { useAuth } from "../AuthContext";

interface LoginLocationState {
  registered?: boolean;
  email?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const locationState = location.state as LoginLocationState | null;

  const [email, setEmail] = useState(locationState?.email ?? "");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [registeredMessage] = useState(Boolean(locationState?.registered));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await login(email.trim().toLowerCase(), password);

      /*
       * Basavaraj backend can require MFA.
       *
       * In that case it returns:
       * mfaRequired = true
       * mfaToken = ...
       */

      if (response.mfaRequired) {
        if (!response.mfaToken) {
          throw new Error(
            "MFA is required, but the backend did not return an MFA token.",
          );
        }

        navigate("/mfa", {
          state: {
            mfaToken: response.mfaToken,
            email: email.trim().toLowerCase(),
          },
        });

        return;
      }

      /*
       * Normal login.
       *
       * AuthContext already stores the JWT and
       * loads the current user.
       */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error("EchoLife login failed:", err);

      const backendResponse = err?.response?.data;

      let message =
        "Unable to sign in. Please check your credentials and try again.";

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
      title="Welcome back"
      description="Sign in to continue to your private family memory space."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {registeredMessage && (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your account has been created successfully. Please sign in to
            continue.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div>
          <Input
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="rounded border-slate-300"
              />
              Show password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign in
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
