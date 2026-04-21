import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { performanceRecords } from "../../lib/dummy-data";

export const Route = createFileRoute("/hr/performance")({ component: PerformancePage });

function PerformancePage() {
  return (
    <AppLayout>
      <PageHeader title="Staff Performance" description="Performance appraisals aligned with organizational goals" />
      <DataTable
        columns={[
          { key: "employee", label: "Employee" },
          { key: "period", label: "Period" },
          { key: "score", label: "Score", render: (item) => {
            const score = (item as Record<string, unknown>).score as number;
            return <span className={`font-semibold ${score >= 90 ? "text-success" : score >= 80 ? "text-primary" : "text-foreground"}`}>{score}%</span>;
          }},
          { key: "rating", label: "Rating", render: (item) => <StatusBadge status={(item as Record<string, unknown>).rating as string} /> },
          { key: "goals", label: "Goals Set" },
          { key: "completed", label: "Completed" },
        ]}
        data={performanceRecords as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
