import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { timesheets } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/timesheets")({ component: TimesheetsPage });

function TimesheetsPage() {
  return (
    <AppLayout>
      <PageHeader title="Timesheet Management" description="Track hours worked by employees" />
      <DataTable
        columns={[
          { key: "employee", label: "Employee" },
          { key: "week", label: "Week" },
          { key: "mon", label: "Mon" },
          { key: "tue", label: "Tue" },
          { key: "wed", label: "Wed" },
          { key: "thu", label: "Thu" },
          { key: "fri", label: "Fri" },
          { key: "total", label: "Total", render: (item) => <span className="font-semibold">{String((item as Record<string, unknown>).total)}h</span> },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={timesheets as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
