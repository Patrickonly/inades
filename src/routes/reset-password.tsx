import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import AuthSplitLayout from "../components/AuthSplitLayout";
import { setOtpSessionContext } from "../lib/otp-session";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — INADES DMS" },
      { name: "description", content: "Send password reset link" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRedirecting) {
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setOtpSessionContext({
      flow: "reset",
      email: email.trim(),
    });

    setMessage("Code sent successfully. Redirecting to OTP verification...");
    setIsRedirecting(true);

    window.setTimeout(() => {
      navigate({ to: "/otp" });
    }, 650);
  };

  return (
    <AuthSplitLayout
      badgeLabel="Password Recovery"
      title="Reset password"
      description="Enter your email, then verify OTP to continue."
      icon={<ShieldAlert className="h-3.5 w-3.5" />}
    >
      <form onSubmit={handleSend} className="inades-stagger-enter mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
            <Mail className="h-4 w-4" />
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@inades.org.rw"
            className="h-10 w-full rounded-lg border border-[#F28C00]/35 bg-[#FFFFFF] px-3 text-sm text-[#000000] outline-none focus:border-[#8BE000] focus:ring-2 focus:ring-[#8BE000]/40"
          />
        </div>

        <button
          type="submit"
          disabled={isRedirecting}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F28C00] px-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#CC7600] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {isRedirecting ? "Redirecting..." : "Send OTP code"}
        </button>
      </form>

      {message && <p className="mt-4 rounded-md border border-[#F28C00]/25 bg-[#F28C00]/8 px-3 py-2 text-sm text-[#000000]">{message}</p>}
    </AuthSplitLayout>
  );
}
