import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { auditRecommendations } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/audit")({ component: AuditPage });

function AuditPage() {
  return (
    <AppLayout>
      <PageHeader title="Audit & Recommendations" description="Track and implement audit, Board, and General Assembly recommendations" />
      <DataTable
        columns={[
          { key: "source", label: "Source" },
          { key: "recommendation", label: "Recommendation" },
          { key: "responsible", label: "Responsible" },
          { key: "deadline", label: "Deadline" },
          { key: "priority", label: "Priority", render: (item) => <StatusBadge status={(item as Record<string, unknown>).priority as string} /> },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={auditRecommendations as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
