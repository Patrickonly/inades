import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { missionReports } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/missions")({ component: MissionsPage });

function MissionsPage() {
  return (
    <AppLayout>
      <PageHeader title="Mission Clearance & Reports" description="Document mission-related activities and expenses" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New Mission</button>} />
      <DataTable
        columns={[
          { key: "id", label: "Ref" },
          { key: "title", label: "Mission" },
          { key: "officer", label: "Officer" },
          { key: "location", label: "Location" },
          { key: "date", label: "Date" },
          { key: "expenses", label: "Expenses (RWF)", render: (item) => ((item as Record<string, unknown>).expenses as number).toLocaleString() },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={missionReports as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
