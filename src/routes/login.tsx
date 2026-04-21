import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, LogIn, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AuthSplitLayout from "../components/AuthSplitLayout";
import {
    getDemoUserById,
    getLoginEligibleUsers,
    getStoredUserId,
    initializeManagedUsers,
    type ManagedUser,
    roleDisplayName,
} from "../lib/auth";
import {
    getPostLoginRedirectPath,
    setOtpSessionContext,
} from "../lib/otp-session";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — INADES DMS" },
      { name: "description", content: "Sign in to INADES DMS" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();

  const [availableUsers, setAvailableUsers] = useState<ManagedUser[]>(() => getLoginEligibleUsers());
  const [selectedUserId, setSelectedUserId] = useState<string>(() => getLoginEligibleUsers()[0]?.id ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const selectedUser = useMemo(
    () => availableUsers.find((user) => user.id === selectedUserId) ?? null,
    [availableUsers, selectedUserId],
  );

  useEffect(() => {
    initializeManagedUsers();

    const users = getLoginEligibleUsers();
    setAvailableUsers(users);
    if (users.length) {
      setSelectedUserId((prev) => users.some((user) => user.id === prev) ? prev : users[0].id);
    } else {
      setSelectedUserId("");
    }

    const existingUserId = getStoredUserId();
    if (getDemoUserById(existingUserId)) {
      navigate({ to: "/", replace: true });
    }
  }, [navigate]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRedirecting) {
      return;
    }

    if (!password.trim()) {
      setMessage("Please enter your password to continue.");
      return;
    }

    if (password.trim().length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (!selectedUser) {
      setMessage("No active user is available for login. Ask an admin to unlock or add users.");
      return;
    }

    const redirectPath = getPostLoginRedirectPath() ?? "/";
    setOtpSessionContext({
      flow: "login",
      userId: selectedUser.id,
      redirectPath,
    });

    setMessage("Login successful. Redirecting to OTP verification...");
    setIsRedirecting(true);

    window.setTimeout(() => {
      navigate({ to: "/otp" });
    }, 650);
  };

  return (
    <AuthSplitLayout
      badgeLabel="Secure Login"
      title="INADES DMS Login"
      description="Select one user, enter your password, then continue with OTP verification."
      icon={<ShieldCheck className="h-3.5 w-3.5" />}
    >
      <form onSubmit={handleLogin} className="inades-stagger-enter space-y-4">
        {availableUsers.length === 0 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            No active users are available. Please contact an administrator.
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="login-user" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
            <UserCircle2 className="h-4 w-4" />
            Login user
          </label>
          <select
            id="login-user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#F28C00]/35 bg-[#FFFFFF] px-3 text-sm text-[#000000] outline-none focus:border-[#8BE000] focus:ring-2 focus:ring-[#8BE000]/40"
          >
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {roleDisplayName[user.role]}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="rounded-lg border border-[#F28C00]/30 bg-[#F28C00]/10 p-3">
            <p className="text-[11px] uppercase tracking-wide text-[#000000]/70">Selected role</p>
            <p className="text-sm font-semibold text-[#000000]">
              {roleDisplayName[selectedUser.role]} • {selectedUser.department}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#000000]">
            <KeyRound className="h-4 w-4" />
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#F28C00]/35 bg-[#FFFFFF] px-3 text-sm text-[#000000] shadow-sm outline-none focus:border-[#8BE000] focus:ring-2 focus:ring-[#8BE000]/40"
          />
        </div>

        <button
          type="submit"
          disabled={isRedirecting || !selectedUser}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F28C00] px-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#CC7600] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogIn className="h-4 w-4" />
          {isRedirecting ? "Redirecting..." : "Continue with OTP Login"}
        </button>
      </form>

      {message && <p className="mt-4 rounded-md border border-[#F28C00]/25 bg-[#F28C00]/8 px-3 py-2 text-sm text-[#000000]">{message}</p>}

      <p className="mt-4 rounded-md border border-[#F28C00]/30 bg-[#F28C00]/10 px-3 py-2 text-[11px] text-[#000000]">
        Demo mode: enter any 6-digit numeric OTP on the next screen.
      </p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <Link to="/reset-password" className="text-[#F28C00] underline underline-offset-2 hover:text-[#CC7600]">
          Forgot password?
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
