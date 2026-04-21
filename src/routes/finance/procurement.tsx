import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { procurementRequests } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/procurement")({ component: ProcurementPage });

function ProcurementPage() {
  return (
    <AppLayout>
      <PageHeader title="Procurement Management" description="RFQ system for procurement processes" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New RFQ</button>} />
      <DataTable
        columns={[
          { key: "id", label: "RFQ #" },
          { key: "item", label: "Item" },
          { key: "category", label: "Category" },
          { key: "budget", label: "Budget (RWF)", render: (item) => ((item as Record<string, unknown>).budget as number).toLocaleString() },
          { key: "requestedBy", label: "Requested By" },
          { key: "bids", label: "Bids" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={procurementRequests as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
