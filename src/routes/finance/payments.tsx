import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import StatsCard from "../../components/StatsCard";
import { paymentRequests } from "../../lib/dummy-data";
import { CreditCard, CheckCircle, Clock, DollarSign } from "lucide-react";

export const Route = createFileRoute("/finance/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const total = paymentRequests.reduce((s, p) => s + p.amount, 0);
  return (
    <AppLayout>
      <PageHeader title="Requests & Payments" description="Process financial requests and payments" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New Request</button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard title="Total Requests" value={paymentRequests.length} icon={CreditCard} />
        <StatsCard title="Pending" value={paymentRequests.filter(p => p.status === "Pending").length} icon={Clock} />
        <StatsCard title="Approved" value={paymentRequests.filter(p => p.status === "Approved").length} icon={CheckCircle} />
        <StatsCard title="Total Amount" value={`${(total / 1000000).toFixed(1)}M RWF`} icon={DollarSign} />
      </div>
      <DataTable
        columns={[
          { key: "id", label: "Ref" },
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
          { key: "amount", label: "Amount (RWF)", render: (item) => ((item as Record<string, unknown>).amount as number).toLocaleString() },
          { key: "requestedBy", label: "Requested By" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={paymentRequests as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
