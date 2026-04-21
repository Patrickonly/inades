import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../../components/AppLayout";
import PageHeader from "../../../components/PageHeader";
import {
    fraudPriorityOptions,
    fraudStatusOptions,
    getFraudReportById,
    updateFraudReport,
} from "../../../lib/fraud-reports-store";

type EditSearch = {
  id?: string;
};

export const Route = createFileRoute("/finance/fraud/edit")({
  validateSearch: (search): EditSearch => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: EditFraudReportPage,
});

function EditFraudReportPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const report = useMemo(() => (id ? getFraudReportById(id) : null), [id]);

  const [form, setForm] = useState({
    type: "Fraud",
    subject: "",
    description: "",
    incidentDate: "",
    reportedBy: "",
    department: "",
    anonymous: false,
    priority: "Medium",
    status: "Submitted",
  });

  useEffect(() => {
    if (!report) {
      return;
    }

    setForm({
      type: report.type,
      subject: report.subject,
      description: report.description,
      incidentDate: report.incidentDate,
      reportedBy: report.reportedBy,
      department: report.department,
      anonymous: report.anonymous,
      priority: report.priority,
      status: report.status,
    });
  }, [report]);

  if (!report) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Report not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The report id is missing or invalid.</p>
          <Link to="/finance/fraud" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Back to Reports List
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.description.trim() || !form.incidentDate.trim()) {
      toast.error("Please complete subject, description, and incident date.");
      return;
    }

    const updated = updateFraudReport(report.id, {
      type: form.type,
      subject: form.subject,
      description: form.description,
      incidentDate: form.incidentDate,
      reportedBy: form.anonymous ? "Anonymous" : form.reportedBy,
      department: form.department,
      anonymous: form.anonymous,
      priority: form.priority as "High" | "Medium" | "Low",
      status: form.status as "Draft" | "Submitted" | "Under Investigation" | "Resolved" | "Closed",
    });

    if (!updated) {
      toast.error("Failed to update report. Please try again.");
      return;
    }

    toast.success(`Report ${updated.reference} updated successfully.`);
    navigate({ to: "/finance/fraud" });
  };

  return (
    <AppLayout>
      <PageHeader
        title={`Edit Report ${report.reference}`}
        description="Update details, change status, and save. No popup is used."
      />

      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report Type</label>
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} title="Report Type" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option>Fraud</option>
              <option>Sexual Harassment</option>
              <option>Misconduct</option>
              <option>Financial Irregularity</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
            <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} title="Status" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              {fraudStatusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject</label>
            <input type="text" value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} placeholder="Subject" title="Subject" required className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date of Incident</label>
            <input type="date" value={form.incidentDate} onChange={(event) => setForm((prev) => ({ ...prev, incidentDate: event.target.value }))} title="Date of Incident" required className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</label>
            <select value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))} title="Priority" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              {fraudPriorityOptions.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reported By</label>
            <input type="text" value={form.reportedBy} onChange={(event) => setForm((prev) => ({ ...prev, reportedBy: event.target.value }))} placeholder="Reporter name" title="Reported By" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</label>
            <input type="text" value={form.department} onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))} placeholder="Department" title="Department" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea rows={5} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Detailed description" title="Description" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save Changes</button>
            <Link to="/finance/fraud" className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
