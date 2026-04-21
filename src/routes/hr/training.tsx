import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { trainings } from "../../lib/dummy-data";

export const Route = createFileRoute("/hr/training")({ component: TrainingPage });

function TrainingPage() {
  return (
    <AppLayout>
      <PageHeader title="Training & Development" description="Track employee training needs, schedules, and outcomes" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Schedule Training</button>} />
      <DataTable
        columns={[
          { key: "title", label: "Training" },
          { key: "provider", label: "Provider" },
          { key: "category", label: "Category" },
          { key: "date", label: "Date" },
          { key: "participants", label: "Participants" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={trainings as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
