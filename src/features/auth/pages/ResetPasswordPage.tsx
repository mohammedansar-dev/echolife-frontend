import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import Button from "../../../components/ui/Button";

function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Password reset"
      description="Password reset is not available yet."
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-700">
          Password reset is not currently available in the EchoLife
          authentication service.
        </div>

        <Link to="/login" className="block">
          <Button type="button" fullWidth>
            Back to sign in
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
