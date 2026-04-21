import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { assets } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/assets")({ component: AssetsPage });

function AssetsPage() {
  return (
    <AppLayout>
      <PageHeader title="Assets Management" description="Monitor and track organizational assets" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Register Asset</button>} />
      <DataTable
        columns={[
          { key: "id", label: "Asset ID" },
          { key: "name", label: "Asset Name" },
          { key: "category", label: "Category" },
          { key: "purchaseDate", label: "Purchase Date" },
          { key: "value", label: "Value (RWF)", render: (item) => ((item as Record<string, unknown>).value as number).toLocaleString() },
          { key: "location", label: "Location" },
          { key: "assignedTo", label: "Assigned To" },
          { key: "condition", label: "Condition", render: (item) => <StatusBadge status={(item as Record<string, unknown>).condition as string} /> },
        ]}
        data={assets as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
