import { createFileRoute, Link } from "@tanstack/react-router";
import AppFooter from "../components/AppFooter";

export const Route = createFileRoute("/logged-out")({
  component: LoggedOutPage,
  head: () => ({
    meta: [
      { title: "Logged out — INADES DMS" },
      { name: "description", content: "You have been logged out" },
    ],
  }),
});

function LoggedOutPage() {
  return (
    <div className="inades-page-enter flex min-h-screen flex-col bg-gradient-to-b from-[#F28C00]/20 via-[#FFFFFF] to-[#FFFFFF]">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="inades-card w-full max-w-lg rounded-2xl border border-[#F28C00]/35 bg-[#FFFFFF] p-8 text-center shadow-[0_14px_34px_rgba(242,140,0,0.14)]">
          <h1 className="text-2xl font-bold text-[#000000]">You are logged out</h1>
          <p className="mt-2 text-sm text-[#000000]/70">
            Your session has ended successfully.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#F28C00] px-5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#CC7600]"
            >
              Go to login
            </Link>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#8BE000]/45 bg-[#FFFFFF] px-5 text-sm font-semibold text-[#000000] hover:bg-[#8BE000]/10"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
