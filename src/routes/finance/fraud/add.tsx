import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../../components/AppLayout";
import PageHeader from "../../../components/PageHeader";
import { roleDisplayName } from "../../../lib/auth";
import {
    createFraudReport,
    fraudPriorityOptions,
    getCurrentUserRole,
} from "../../../lib/fraud-reports-store";

export const Route = createFileRoute("/finance/fraud/add")({ component: AddFraudReportPage });

function AddFraudReportPage() {
  const navigate = useNavigate();
  const role = useMemo(() => getCurrentUserRole(), []);

  const [form, setForm] = useState({
    type: "Fraud",
    subject: "",
    description: "",
    incidentDate: "",
    reportedBy: "",
    department: "",
    anonymous: false,
    priority: "Medium",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = form.subject.trim();
    const description = form.description.trim();
    const department = form.department.trim();
    const reportedBy = form.reportedBy.trim();

    if (!subject || !description || !form.incidentDate.trim()) {
      toast.error("Please complete subject, description, and incident date.");
      return;
    }

    if (subject.length < 5) {
      toast.error("Subject must be at least 5 characters.");
      return;
    }

    if (description.length < 15) {
      toast.error("Description must be at least 15 characters.");
      return;
    }

    const incidentDate = new Date(form.incidentDate);
    if (Number.isNaN(incidentDate.getTime())) {
      toast.error("Please enter a valid incident date.");
      return;
    }

    const now = new Date();
    if (incidentDate.getTime() > now.getTime()) {
      toast.error("Incident date cannot be in the future.");
      return;
    }

    if (!department || department.length < 2) {
      toast.error("Department is required and must be at least 2 characters.");
      return;
    }

    if (!form.anonymous && (!reportedBy || reportedBy.length < 3)) {
      toast.error("Reporter name is required (minimum 3 characters) when not anonymous.");
      return;
    }

    const created = createFraudReport({
      type: form.type,
      subject,
      description,
      incidentDate: form.incidentDate,
      reportedBy: form.anonymous ? "Anonymous" : reportedBy,
      department,
      anonymous: form.anonymous,
      priority: form.priority as "High" | "Medium" | "Low",
      createdByRole: role,
    });

    toast.success(`Report ${created.reference} created successfully.`);
    navigate({ to: "/finance/fraud" });
  };

  return (
    <AppLayout>
      <PageHeader
        title="Add Alert Report"
        description={`Create a new report as ${roleDisplayName[role]}. After save, you will be redirected to reports list.`}
      />

      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report Type</label>
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              title="Report Type"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option>Fraud</option>
              <option>Sexual Harassment</option>
              <option>Misconduct</option>
              <option>Financial Irregularity</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</label>
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              title="Priority"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {fraudPriorityOptions.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              placeholder="Brief title of the incident"
              title="Subject"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date of Incident</label>
            <input
              type="date"
              value={form.incidentDate}
              onChange={(event) => setForm((prev) => ({ ...prev, incidentDate: event.target.value }))}
              title="Date of Incident"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
              placeholder="Finance / Programs / HR..."
              title="Department"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reported By</label>
            <input
              type="text"
              value={form.reportedBy}
              onChange={(event) => setForm((prev) => ({ ...prev, reportedBy: event.target.value }))}
              placeholder="Reporter name"
              title="Reported By"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.anonymous}
                onChange={(event) => setForm((prev) => ({ ...prev, anonymous: event.target.checked }))}
                className="h-4 w-4"
              />
              Submit anonymously
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe what happened"
              title="Description"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save Report
            </button>
            <Link
              to="/finance/fraud"
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
