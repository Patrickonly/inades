import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { vehicles } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/vehicles")({ component: VehiclesPage });

function VehiclesPage() {
  return (
    <AppLayout>
      <PageHeader title="Vehicle Management" description="Track vehicle usage, maintenance and costs" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Add Vehicle</button>} />
      <DataTable
        columns={[
          { key: "plate", label: "Plate" },
          { key: "make", label: "Make/Model" },
          { key: "year", label: "Year" },
          { key: "mileage", label: "Mileage (km)", render: (item) => ((item as Record<string, unknown>).mileage as number).toLocaleString() },
          { key: "lastService", label: "Last Service" },
          { key: "assignedTo", label: "Assigned To" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={vehicles as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
