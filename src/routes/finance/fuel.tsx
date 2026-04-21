import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import { fuelRecords } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/fuel")({ component: FuelPage });

function FuelPage() {
  return (
    <AppLayout>
      <PageHeader title="Fuel Management" description="Monitor fuel consumption and expenditures" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Log Fuel</button>} />
      <DataTable
        columns={[
          { key: "vehicle", label: "Vehicle" },
          { key: "date", label: "Date" },
          { key: "liters", label: "Liters" },
          { key: "cost", label: "Cost (RWF)", render: (item) => ((item as Record<string, unknown>).cost as number).toLocaleString() },
          { key: "station", label: "Station" },
          { key: "driver", label: "Driver" },
        ]}
        data={fuelRecords as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
