import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Home, LayoutDashboard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { getDemoUserById, getStoredUserId, roleDisplayName } from "../lib/auth";
import { getRoleVisibleFraudReports, initializeFraudReports, type FraudReport } from "../lib/fraud-reports-store";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "INADES Home — Digital Management System" },
      { name: "description", content: "Home overview for INADES-Formation Rwanda DMS." },
    ],
  }),
});

function Dashboard() {
  const user = useMemo(() => getDemoUserById(getStoredUserId()), []);
  const role = user?.role ?? "office";
  const [reports, setReports] = useState<FraudReport[]>([]);

  useEffect(() => {
    initializeFraudReports();
    setReports(getRoleVisibleFraudReports(role));
  }, [role]);

  const submitted = reports.filter((report) => report.status === "Submitted").length;
  const underInvestigation = reports.filter((report) => report.status === "Under Investigation").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Home"
          description={`Welcome ${user?.name ?? "User"}. You are currently signed in as ${roleDisplayName[role]}.`}
          actions={
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open Dashboard
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Home Status" value="Active" icon={Home} subtitle="Current access is live" />
          <StatsCard title="Visible Reports" value={reports.length} icon={FileText} subtitle="Role-based data" />
          <StatsCard title="Submitted" value={submitted} icon={ArrowRight} trend="Awaiting review" />
          <StatsCard title="Under Investigation" value={underInvestigation} icon={LayoutDashboard} trend="Track progress" trendUp />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Reports & Analytics</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Reports are generated from existing data. This page is for overview only — use the fraud module for adding and editing report records.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/reports" className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Go to Reports & Analytics
            </Link>
            <Link to="/finance/fraud" className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Go to Fraud & Harassment Alerts
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Recent Visible Reports</h2>
          <div className="space-y-2">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{report.reference} • {report.subject}</p>
                  <p className="text-xs text-muted-foreground">{report.department} • {report.type}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports visible for your current role.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
