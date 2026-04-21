import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle, Clock, FilePlus2, Pencil, Trash2, XCircle } from "lucide-react";
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
import {
    deleteLeaveRequest,
    getCurrentLeaveUserRole,
    getRoleVisibleLeaveRequests,
    initializeLeaveRequests,
    leaveStatusOptions,
    setLeaveRequestStatus,
    type LeaveRequest,
    type LeaveStatus,
} from "../../lib/leave-requests-store";

export const Route = createFileRoute("/hr/leave")({ component: LeavePage });

function LeavePage() {
  const role = useMemo(() => getCurrentLeaveUserRole(), []);
  const canDelete = role === "admin" || role === "hr";
  const canChangeStatus = role === "admin" || role === "hr";
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [pendingDelete, setPendingDelete] = useState<LeaveRequest | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    request: LeaveRequest;
    nextStatus: LeaveStatus;
  } | null>(null);

  const reload = () => {
    setRequests(getRoleVisibleLeaveRequests(role));
  };

  useEffect(() => {
    initializeLeaveRequests();
    reload();
  }, [role]);

  const approvedCount = requests.filter((request) => request.status === "Approved").length;
  const pendingCount = requests.filter((request) => request.status === "Pending").length;
  const rejectedCount = requests.filter((request) => request.status === "Rejected").length;

  return (
    <AppLayout>
      <PageHeader
        title="Leave Management"
        description="Track, add, edit, update status, and delete employee leave requests."
        actions={
          <Link
            to="/hr/leave/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <FilePlus2 className="h-4 w-4" />
            Request Leave
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard title="Total Requests" value={requests.length} icon={CalendarDays} />
        <StatsCard title="Approved" value={approvedCount} icon={CheckCircle} />
        <StatsCard title="Pending" value={pendingCount} icon={Clock} />
        <StatsCard title="Rejected" value={rejectedCount} icon={XCircle} />
      </div>
      <DataTable
        columns={[
          { key: "reference", label: "Reference" },
          { key: "employee", label: "Employee" },
          { key: "type", label: "Leave Type" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "days", label: "Days" },
          { key: "reason", label: "Reason" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as LeaveRequest).status} /> },
          {
            key: "changeStatus",
            label: "Change Status",
            render: (item) => {
              const request = item as LeaveRequest;

              return (
                canChangeStatus ? (
                  <select
                    value={request.status}
                    onChange={(event) => {
                      const nextStatus = event.target.value as LeaveStatus;
                      if (nextStatus === request.status) {
                        return;
                      }

                      setPendingStatusChange({ request, nextStatus });
                    }}
                    title={`Change status for ${request.reference}`}
                    aria-label={`Change status for ${request.reference}`}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {leaveStatusOptions.map((status) => (
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
              const request = item as LeaveRequest;

              return (
                <div className="flex items-center gap-1">
                  <Link
                    to="/hr/leave/edit"
                    search={{ id: request.id }}
                    className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete(request)}
                    disabled={!canDelete}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
                    title="Delete leave request"
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
        data={requests as unknown as Record<string, unknown>[]}
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
                ? `Change ${pendingStatusChange.request.reference} from "${pendingStatusChange.request.status}" to "${pendingStatusChange.nextStatus}"?`
                : "Are you sure you want to change this leave status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingStatusChange) {
                  return;
                }

                const updated = setLeaveRequestStatus(pendingStatusChange.request.id, pendingStatusChange.nextStatus);
                if (!updated) {
                  toast.error("Failed to update leave status.");
                  return;
                }

                toast.success(`Leave status updated to ${pendingStatusChange.nextStatus}.`);
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
            <AlertDialogTitle>Delete leave request</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `Are you sure you want to delete ${pendingDelete.reference}? This action cannot be undone.`
                : "Are you sure you want to delete this leave request?"}
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

                deleteLeaveRequest(pendingDelete.id);
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
