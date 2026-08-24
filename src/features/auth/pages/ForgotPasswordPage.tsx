import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { forgotPassword } from "../auth.api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setError("Enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);

      setSuccess(true);
    } catch {
      /*
       * For security, production systems often
       * return a generic success message so that
       * an attacker cannot discover whether an
       * email exists.
       */

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll help you reset your password."
    >
      {success ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-4 text-sm leading-6 text-green-700">
            If an account exists for this email, you'll receive instructions to
            reset your password.
          </div>

          <Link
            to="/login"
            className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            id="forgot-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button type="submit" fullWidth loading={loading}>
            Send reset instructions
          </Button>

          <p className="text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
