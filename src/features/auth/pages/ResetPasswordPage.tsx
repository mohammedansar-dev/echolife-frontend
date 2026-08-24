import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthLayout from "../components/AuthLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { register as registerApi } from "../auth.api";

const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "Name must be at least 2 characters"),

    email: z.string().trim().email("Enter a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerApi({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      });

      console.log("EchoLife registration successful:", response);

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email: data.email,
        },
      });
    } catch (error: any) {
      console.error("EchoLife registration failed:", error);

      const backendMessage = error?.response?.data;

      let message = "We couldn't create your account. Please try again.";

      if (typeof backendMessage === "string") {
        message = backendMessage;
      } else if (backendMessage && typeof backendMessage.message === "string") {
        message = backendMessage.message;
      }

      setError("root", {
        message,
      });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start building your private family memory space."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        <Input
          id="displayName"
          label="Full name"
          placeholder="Enter your name"
          autoComplete="name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />

        <Input
          id="register-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Enter your password again"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <p className="text-xs leading-5 text-slate-500">
          Your account and memories are protected by EchoLife's privacy and
          security controls.
        </p>

        <Button type="submit" fullWidth loading={isSubmitting}>
          Create account
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
