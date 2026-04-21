import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import StatsCard from "../../components/StatsCard";
import { jobVacancies, employees } from "../../lib/dummy-data";
import { Briefcase, Users, UserCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/hr/recruitment")({
  component: RecruitmentPage,
});

function RecruitmentPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Recruitment Management"
        description="Manage job vacancies, applications, and candidate profiles"
        actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Post Vacancy</button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard title="Open Positions" value={jobVacancies.filter(j => j.status === "Open").length} icon={Briefcase} />
        <StatsCard title="Total Applications" value={jobVacancies.reduce((s, j) => s + j.applications, 0)} icon={FileText} />
        <StatsCard title="Total Staff" value={employees.length} icon={Users} />
        <StatsCard title="New Hires (Q1)" value={2} icon={UserCheck} />
      </div>
      <DataTable
        columns={[
          { key: "title", label: "Position" },
          { key: "department", label: "Department" },
          { key: "location", label: "Location" },
          { key: "deadline", label: "Deadline" },
          { key: "applications", label: "Applications" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={jobVacancies as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
