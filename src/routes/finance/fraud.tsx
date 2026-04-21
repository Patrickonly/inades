import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, FilePlus2, Pencil, Search, Shield, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../components/AppLayout";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import StatsCard from "../../components/StatsCard";
import StatusBadge from "../../components/StatusBadge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { roleDisplayName } from "../../lib/auth";
import {
    deleteFraudReport,
    fraudStatusOptions,
    getCurrentUserRole,
    getRoleVisibleFraudReports,
    initializeFraudReports,
    setFraudReportStatus,
    type FraudReport,
    type FraudStatus,
} from "../../lib/fraud-reports-store";

export const Route = createFileRoute("/finance/fraud")({ component: FraudPage });

function FraudPage() {
  const role = useMemo(() => getCurrentUserRole(), []);
  const canDelete = role === "admin";
  const canChangeStatus = role === "admin" || role === "finance";
  const [query, setQuery] = useState("");
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [pendingDelete, setPendingDelete] = useState<FraudReport | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    report: FraudReport;
    nextStatus: FraudStatus;
  } | null>(null);

  const reload = () => {
    setReports(getRoleVisibleFraudReports(role));
  };

  useEffect(() => {
    initializeFraudReports();
    reload();
  }, [role]);

  const filteredReports = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return reports;
    }

    return reports.filter((report) =>
      [report.reference, report.type, report.subject, report.status, report.department]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [reports, query]);

  const submittedCount = reports.filter((r) => r.status === "Submitted").length;
  const investigationCount = reports.filter((r) => r.status === "Under Investigation").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  return (
    <AppLayout>
      <PageHeader
        title="Fraud & Harassment Alert Center"
        description={`Interactive reports for ${roleDisplayName[role]} users. Add and edit on dedicated pages, with popup confirmation for status updates and delete actions.`}
        actions={
          <>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/finance/fraud/add"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <FilePlus2 className="h-4 w-4" />
              Add Report
            </Link>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Reports" value={reports.length} icon={AlertTriangle} />
        <StatsCard title="Submitted" value={submittedCount} icon={Shield} />
        <StatsCard title="Under Investigation" value={investigationCount} icon={Search} />
        <StatsCard title="Resolved" value={resolvedCount} icon={BarChart3} trend="Track closure progress" trendUp />
      </div>

      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <label htmlFor="fraud-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Search reports
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="fraud-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ref, type, subject, status, department..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <DataTable
        columns={[
          { key: "reference", label: "Reference" },
          { key: "type", label: "Type" },
          { key: "subject", label: "Subject" },
          { key: "department", label: "Department" },
          { key: "incidentDate", label: "Incident Date" },
          {
            key: "status",
            label: "Status",
            render: (item) => <StatusBadge status={(item as FraudReport).status} />,
          },
          {
            key: "changeStatus",
            label: "Change Status",
            render: (item) => {
              const report = item as FraudReport;
              return (
                canChangeStatus ? (
                  <select
                    value={report.status}
                    onChange={(event) => {
                      const nextStatus = event.target.value as FraudStatus;
                      if (nextStatus === report.status) {
                        return;
                      }

                      setPendingStatusChange({
                        report,
                        nextStatus,
                      });
                    }}
                    title={`Change status for ${report.reference}`}
                    aria-label={`Change status for ${report.reference}`}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {fraudStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    Locked
                  </span>
                )
              );
            },
          },
          {
            key: "actions",
            label: "Actions",
            render: (item) => {
              const report = item as FraudReport;
              return (
                <div className="flex items-center gap-1">
                  <Link
                    to="/finance/fraud/edit"
                    search={{ id: report.id }}
                    className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setPendingDelete(report);
                    }}
                    disabled={!canDelete}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
                    title="Delete report"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {canDelete ? "Delete" : "Locked"}
                  </button>
                </div>
              );
            },
          },
        ]}
        enableAutoCrud={false}
        data={filteredReports as unknown as Record<string, unknown>[]}
      />

      <AlertDialog
        open={Boolean(pendingStatusChange)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStatusChange(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm status change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusChange
                ? `Change ${pendingStatusChange.report.reference} from "${pendingStatusChange.report.status}" to "${pendingStatusChange.nextStatus}"?`
                : "Are you sure you want to change this status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingStatusChange) {
                  return;
                }

                const updated = setFraudReportStatus(pendingStatusChange.report.id, pendingStatusChange.nextStatus);
                if (!updated) {
                  toast.error("Failed to change report status.");
                  return;
                }

                toast.success(`Status updated to ${pendingStatusChange.nextStatus}.`);
                reload();
                setPendingStatusChange(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `Are you sure you want to delete ${pendingDelete.reference}? This action cannot be undone.`
                : "Are you sure you want to delete this report?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!pendingDelete) {
                  return;
                }

                deleteFraudReport(pendingDelete.id);
                toast.success(`${pendingDelete.reference} deleted successfully.`);
                reload();
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
