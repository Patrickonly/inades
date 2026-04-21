import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { useState } from "react";
import AuthSplitLayout from "../components/AuthSplitLayout";

type ForgotSearch = {
  email?: string;
};

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (search): ForgotSearch => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Forgot Password — INADES DMS" },
      { name: "description", content: "Set new password and confirm" },
    ],
  }),
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const passwordStrengthPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setMessage("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!passwordStrengthPattern.test(newPassword)) {
      setMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");
    window.setTimeout(() => {
      navigate({ to: "/login", replace: true });
    }, 700);
  };

  return (
    <AuthSplitLayout
      badgeLabel="Set New Password"
      title="Forgot password"
      description="Enter your new password and confirm it."
      icon={<LockKeyhole className="h-3.5 w-3.5" />}
    >
      {email && (
        <p className="mt-3 rounded-md border border-[#F28C00]/30 bg-[#F28C00]/10 p-2 text-xs text-[#000000]">
          Reset for: <span className="font-medium text-[#000000]">{email}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="inades-stagger-enter mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
            <KeyRound className="h-4 w-4" />
            New password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="h-10 w-full rounded-lg border border-[#F28C00]/35 bg-[#FFFFFF] px-3 text-sm text-[#000000] outline-none focus:border-[#8BE000] focus:ring-2 focus:ring-[#8BE000]/40"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
            <CheckCircle2 className="h-4 w-4" />
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="h-10 w-full rounded-lg border border-[#F28C00]/35 bg-[#FFFFFF] px-3 text-sm text-[#000000] outline-none focus:border-[#8BE000] focus:ring-2 focus:ring-[#8BE000]/40"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F28C00] px-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#CC7600]"
        >
          <CheckCircle2 className="h-4 w-4" />
          Update password
        </button>
      </form>

      {message && <p className="mt-4 rounded-md border border-[#F28C00]/25 bg-[#F28C00]/8 px-3 py-2 text-sm text-[#000000]">{message}</p>}

      <p className="mt-4 text-xs text-[#000000]/70">
        Back to{" "}
        <Link to="/login" className="text-[#F28C00] underline underline-offset-2 hover:text-[#CC7600]">
          login
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
