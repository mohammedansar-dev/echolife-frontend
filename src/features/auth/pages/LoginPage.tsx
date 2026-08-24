import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import AuthLayout from "../components/AuthLayout";

import Input from "../../../components/ui/Input";

import Button from "../../../components/ui/Button";

import { useAuth } from "../AuthContext";

/* =========================================================
   VALIDATION
   ========================================================= */

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/* =========================================================
   PAGE
   ========================================================= */

function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },

    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* =======================================================
     LOGIN SUBMIT
     ======================================================= */

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      /*
       * If the user originally tried to access
       * a protected page, return them there.
       */

      const state = location.state as {
        from?: string;
      } | null;

      const destination = state?.from || "/app/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error: any) {
      console.error("EchoLife login failed:", error);

      let message = "Invalid email or password. Please try again.";

      const backendResponse = error?.response?.data;

      if (typeof backendResponse === "string") {
        message = backendResponse;
      } else if (backendResponse?.message) {
        message = backendResponse.message;
      }

      setError("root", {
        message,
      });
    }
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your EchoLife account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        <Input
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
