import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";

export const Route = createFileRoute("/hr/disciplinary")({ component: DisciplinaryPage });

const cases = [
  { id: "DIS-001", employee: "John Doe", type: "Tardiness", date: "2026-03-15", severity: "Low", status: "Resolved", action: "Written Warning" },
  { id: "DIS-002", employee: "Jane Smith", type: "Policy Violation", date: "2026-04-01", severity: "Medium", status: "Under Review", action: "Pending" },
  { id: "DIS-003", employee: "Alex Brown", type: "Misconduct", date: "2026-04-08", severity: "High", status: "In Progress", action: "Suspension" },
];

function DisciplinaryPage() {
  return (
    <AppLayout>
      <PageHeader title="Disciplinary Management" description="Report, record and manage disciplinary actions" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Report Incident</button>} />
      <DataTable
        columns={[
          { key: "id", label: "Case ID" },
          { key: "employee", label: "Employee" },
          { key: "type", label: "Type" },
          { key: "date", label: "Date" },
          { key: "severity", label: "Severity", render: (item) => <StatusBadge status={(item as Record<string, unknown>).severity as string} /> },
          { key: "action", label: "Action Taken" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={cases as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
