import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import { employees } from "../../lib/dummy-data";

export const Route = createFileRoute("/hr/compensation")({ component: CompensationPage });

const salaryData = employees.map((e, i) => ({
  ...e,
  baseSalary: [450000, 380000, 320000, 350000, 300000, 340000, 280000, 290000][i],
  allowances: [80000, 60000, 50000, 55000, 45000, 50000, 40000, 45000][i],
  deductions: [45000, 38000, 32000, 35000, 30000, 34000, 28000, 29000][i],
}));

function CompensationPage() {
  return (
    <AppLayout>
      <PageHeader title="Compensation & Benefits" description="Payroll and benefits management" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Run Payroll</button>} />
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "role", label: "Role" },
          { key: "baseSalary", label: "Base Salary (RWF)", render: (item) => ((item as Record<string, unknown>).baseSalary as number).toLocaleString() },
          { key: "allowances", label: "Allowances", render: (item) => ((item as Record<string, unknown>).allowances as number).toLocaleString() },
          { key: "deductions", label: "Deductions", render: (item) => ((item as Record<string, unknown>).deductions as number).toLocaleString() },
          { key: "net", label: "Net Pay", render: (item) => {
            const r = item as Record<string, unknown>;
            return ((r.baseSalary as number) + (r.allowances as number) - (r.deductions as number)).toLocaleString();
          }},
        ]}
        data={salaryData as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
