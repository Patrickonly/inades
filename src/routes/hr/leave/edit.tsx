import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../../components/AppLayout";
import PageHeader from "../../../components/PageHeader";
import {
    getLeaveRequestById,
    leaveStatusOptions,
    leaveTypeOptions,
    updateLeaveRequest,
} from "../../../lib/leave-requests-store";

type EditSearch = {
  id?: string;
};

export const Route = createFileRoute("/hr/leave/edit")({
  validateSearch: (search): EditSearch => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: EditLeaveRequestPage,
});

function EditLeaveRequestPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const request = useMemo(() => (id ? getLeaveRequestById(id) : null), [id]);

  const [form, setForm] = useState({
    employee: "",
    type: "Annual Leave",
    from: "",
    to: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    if (!request) {
      return;
    }

    setForm({
      employee: request.employee,
      type: request.type,
      from: request.from,
      to: request.to,
      reason: request.reason,
      status: request.status,
    });
  }, [request]);

  if (!request) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Leave request not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The leave request id is missing or invalid.</p>
          <Link to="/hr/leave" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Back to Leave Management
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.employee.trim() || !form.from.trim() || !form.to.trim() || !form.reason.trim()) {
      toast.error("Please complete employee, dates, and reason.");
      return;
    }

    const updated = updateLeaveRequest(request.id, {
      employee: form.employee,
      type: form.type,
      from: form.from,
      to: form.to,
      reason: form.reason,
      status: form.status as "Pending" | "Approved" | "Rejected" | "Cancelled",
    });

    if (!updated) {
      toast.error("Failed to update leave request. Please try again.");
      return;
    }

    toast.success(`Leave request ${updated.reference} updated successfully.`);
    navigate({ to: "/hr/leave" });
  };

  return (
    <AppLayout>
      <PageHeader
        title={`Edit Leave Request ${request.reference}`}
        description="Update leave details and status, then save your changes."
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              title="Status"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {leaveStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

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
              Save Changes
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
