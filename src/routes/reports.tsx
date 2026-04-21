import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, BarChart3, CheckCircle2, Clock, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { roleDisplayName } from "../lib/auth";
import {
    getCurrentUserRole,
    getRoleVisibleFraudReports,
    initializeFraudReports,
    type FraudReport,
} from "../lib/fraud-reports-store";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const hrModuleLinks = [
  { label: "Recruitment", to: "/hr/recruitment" },
  { label: "Training", to: "/hr/training" },
  { label: "Performance", to: "/hr/performance" },
  { label: "Leave Management", to: "/hr/leave" },
  { label: "Compensation", to: "/hr/compensation" },
  { label: "Disciplinary", to: "/hr/disciplinary" },
  { label: "Reports", to: "/reports" },
];

const financialModuleLinks = [
  { label: "Payments", to: "/finance/payments" },
  { label: "Travel Requests", to: "/finance/travel" },
  { label: "Vehicle Management", to: "/finance/vehicles" },
  { label: "Fuel Management", to: "/finance/fuel" },
  { label: "Mission Reports", to: "/finance/missions" },
  { label: "Procurement", to: "/finance/procurement" },
  { label: "Auctions", to: "/finance/auctions" },
  { label: "Petty Cash", to: "/finance/petty-cash" },
  { label: "Timesheets", to: "/finance/timesheets" },
  { label: "Audit & Recommendations", to: "/finance/audit" },
  { label: "Stock Management", to: "/finance/stock" },
  { label: "Assets", to: "/finance/assets" },
  { label: "Fraud & Harassment Alerts", to: "/finance/fraud" },
  { label: "Reports", to: "/reports" },
];

function ReportsPage() {
  const role = useMemo(() => getCurrentUserRole(), []);
  const [reports, setReports] = useState<FraudReport[]>([]);

  useEffect(() => {
    initializeFraudReports();
    setReports(getRoleVisibleFraudReports(role));
  }, [role]);

  const submitted = reports.filter((report) => report.status === "Submitted").length;
  const underInvestigation = reports.filter((report) => report.status === "Under Investigation").length;
  const resolved = reports.filter((report) => report.status === "Resolved").length;

  return (
    <AppLayout>
      <PageHeader
        title="Reports & Analytics"
        description={`Role-aware analytics for ${roleDisplayName[role]} users. Reports are generated from system data and are not manually added on this page.`}
      />

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Report Links</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Open the report-related files below. Add/edit forms are available for leave requests and fraud reports.
        </p>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Human Resources</h3>
            <div className="flex flex-wrap gap-2">
              {hrModuleLinks.map((link) => (
                <Link key={link.to + link.label} to={link.to} className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  <FileText className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Financial Management</h3>
            <div className="flex flex-wrap gap-2">
              {financialModuleLinks.map((link) => (
                <Link key={link.to + link.label} to={link.to} className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  <FileText className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Form Links (Add / Edit)</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/hr/leave/add" className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5" />
              Add Leave Request
            </Link>
            <Link to="/hr/leave" className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5" />
              Edit Leave Request (from list)
            </Link>
            <Link to="/finance/fraud/add" className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5" />
              Add Alert Report
            </Link>
            <Link to="/finance/fraud" className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5" />
              Edit Alert Report (from list)
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5" />
              Dashboard Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Reports" value={reports.length} icon={BarChart3} />
        <StatsCard title="Submitted" value={submitted} icon={Clock} />
        <StatsCard title="Under Investigation" value={underInvestigation} icon={Activity} />
        <StatsCard title="Resolved" value={resolved} icon={CheckCircle2} trend="Resolution tracking" trendUp />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Reports Overview (Data-Derived)</h2>
        <DataTable
          columns={[
            { key: "reference", label: "Reference" },
            { key: "type", label: "Type" },
            { key: "subject", label: "Subject" },
            { key: "department", label: "Department" },
            { key: "createdByRole", label: "Created By Role", render: (item) => roleDisplayName[(item as FraudReport).createdByRole] },
            { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as FraudReport).status} /> },
            { key: "priority", label: "Priority", render: (item) => <StatusBadge status={(item as FraudReport).priority} /> },
          ]}
          enableAutoCrud={false}
          data={reports as unknown as Record<string, unknown>[]}
        />
      </div>
    </AppLayout>
  );
}
