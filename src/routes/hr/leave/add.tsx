import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../../components/AppLayout";
import PageHeader from "../../../components/PageHeader";
import { roleDisplayName } from "../../../lib/auth";
import {
    createLeaveRequest,
    getCurrentLeaveUserRole,
    leaveTypeOptions,
} from "../../../lib/leave-requests-store";

export const Route = createFileRoute("/hr/leave/add")({ component: AddLeaveRequestPage });

function AddLeaveRequestPage() {
  const navigate = useNavigate();
  const role = useMemo(() => getCurrentLeaveUserRole(), []);

  const [form, setForm] = useState({
    employee: "",
    type: "Annual Leave",
    from: "",
    to: "",
    reason: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const employee = form.employee.trim();
    const reason = form.reason.trim();

    if (!employee || !form.from.trim() || !form.to.trim() || !reason) {
      toast.error("Please complete employee, dates, and reason.");
      return;
    }

    if (employee.length < 3) {
      toast.error("Employee name must be at least 3 characters.");
      return;
    }

    if (reason.length < 10) {
      toast.error("Reason must be at least 10 characters.");
      return;
    }

    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      toast.error("Please enter valid leave dates.");
      return;
    }

    if (fromDate.getTime() > toDate.getTime()) {
      toast.error("Leave start date cannot be after end date.");
      return;
    }

    const created = createLeaveRequest({
      employee,
      type: form.type,
      from: form.from,
      to: form.to,
      reason,
      createdByRole: role,
    });

    toast.success(`Leave request ${created.reference} created successfully.`);
    navigate({ to: "/hr/leave" });
  };

  return (
    <AppLayout>
      <PageHeader
        title="Request Leave"
        description={`Create a leave request as ${roleDisplayName[role]}. You will be redirected back to Leave Management after save.`}
      />

      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employee</label>
            <input
              type="text"
              value={form.employee}
              onChange={(event) => setForm((prev) => ({ ...prev, employee: event.target.value }))}
              placeholder="Employee full name"
              title="Employee"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Leave Type</label>
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              title="Leave Type"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {leaveTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</label>
            <input
              type="date"
              value={form.from}
              onChange={(event) => setForm((prev) => ({ ...prev, from: event.target.value }))}
              title="From"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</label>
            <input
              type="date"
              value={form.to}
              onChange={(event) => setForm((prev) => ({ ...prev, to: event.target.value }))}
              title="To"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</label>
            <textarea
              rows={4}
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
              placeholder="Provide reason for leave request"
              title="Reason"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save Request
            </button>
            <Link
              to="/hr/leave"
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
