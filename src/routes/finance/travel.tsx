import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { travelRequests } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/travel")({ component: TravelPage });

function TravelPage() {
  return (
    <AppLayout>
      <PageHeader title="Travel Requests & Authorization" description="Submit and approve travel requests" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New Travel Request</button>} />
      <DataTable
        columns={[
          { key: "id", label: "Ref" },
          { key: "employee", label: "Employee" },
          { key: "destination", label: "Destination" },
          { key: "purpose", label: "Purpose" },
          { key: "departure", label: "Departure" },
          { key: "return", label: "Return" },
          { key: "budget", label: "Budget (RWF)", render: (item) => ((item as Record<string, unknown>).budget as number).toLocaleString() },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={travelRequests as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
