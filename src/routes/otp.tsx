import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AuthSplitLayout from "../components/AuthSplitLayout";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { getDemoUserById, setStoredUserId } from "../lib/auth";
import {
    clearOtpSessionContext,
    getOtpSessionContext,
    type OtpSessionContext,
} from "../lib/otp-session";

export const Route = createFileRoute("/otp")({
  component: OtpPage,
  head: () => ({
    meta: [
      { title: "OTP Verification — INADES DMS" },
      { name: "description", content: "Verify OTP to continue to INADES DMS" },
    ],
  }),
});

function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sessionContext, setSessionContext] = useState<OtpSessionContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSessionContext(getOtpSessionContext());
    setIsLoaded(true);
  }, []);

  const flow = sessionContext?.flow ?? "login";
  const selectedUser = useMemo(() => getDemoUserById(sessionContext?.userId), [sessionContext?.userId]);

  const handleOtpChange = (nextValue: string) => {
    const numericValue = nextValue.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
    if (message) {
      setMessage(null);
    }
  };

  const handleVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionContext) {
      setMessage("Session expired. Please go back and start again.");
      return;
    }

    if (!otp.trim()) {
      setMessage("Enter your 6-digit OTP to continue.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage("OTP must contain exactly 6 numbers.");
      return;
    }

    if (flow === "login") {
      if (!selectedUser) {
        setMessage("Login session expired. Please go back and sign in again.");
        return;
      }

      setStoredUserId(selectedUser.id);
      const redirectPath = sessionContext.redirectPath?.startsWith("/") ? sessionContext.redirectPath : "/";
      clearOtpSessionContext();
      navigate({ to: redirectPath, replace: true });
      return;
    }

    clearOtpSessionContext();
    navigate({
      to: "/forgot-password",
      replace: true,
    });
  };

  const helperLabel = flow === "login" ? "Complete login verification" : "Complete password reset verification";

  if (!isLoaded) {
    return (
      <AuthSplitLayout
        badgeLabel="OTP Verification"
        title="Enter OTP"
        description="Loading verification session..."
        icon={<ShieldCheck className="h-3.5 w-3.5" />}
      >
        <p className="text-sm text-[#000000]/70">Preparing secure verification...</p>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      badgeLabel="OTP Verification"
      title="Enter OTP"
      description={helperLabel}
      icon={<ShieldCheck className="h-3.5 w-3.5" />}
    >
      <div className="rounded-md border border-[#F28C00]/30 bg-[#F28C00]/10 px-3 py-2 text-xs text-[#000000]">
        Demo mode: enter any 6-digit numeric OTP.
      </div>

      {!sessionContext && (
        <div className="mt-3 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
          No active OTP session found. Please start from login or password reset.
        </div>
      )}

      <form onSubmit={handleVerify} className="inades-stagger-enter mt-5 space-y-4">
        <label className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
          <Smartphone className="h-4 w-4" />
          One-time password
        </label>

        <div className="flex justify-center rounded-lg border border-[#F28C00]/20 bg-[#FFFFFF] p-3">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F28C00] px-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#CC7600]"
        >
          <ShieldCheck className="h-4 w-4" />
          Verify and continue
        </button>
      </form>

      {message && <p className="mt-4 rounded-md border border-[#F28C00]/25 bg-[#F28C00]/8 px-3 py-2 text-sm text-[#000000]">{message}</p>}

      <div className="mt-4 text-xs text-[#000000]/70">
        <Link
          to={flow === "reset" ? "/reset-password" : "/login"}
          onClick={() => clearOtpSessionContext()}
          className="inline-flex items-center gap-1 text-[#F28C00] underline underline-offset-2 hover:text-[#CC7600]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
