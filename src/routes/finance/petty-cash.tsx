import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatsCard from "../../components/StatsCard";
import { pettyCash } from "../../lib/dummy-data";
import { Wallet, ArrowDown, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/finance/petty-cash")({ component: PettyCashPage });

function PettyCashPage() {
  const totalSpent = pettyCash.reduce((s, p) => s + p.amount, 0);
  return (
    <AppLayout>
      <PageHeader title="Petty Cash Management" description="Track petty cash transactions and balances" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Record Transaction</button>} />
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatsCard title="Current Balance" value={`${pettyCash[0].balance.toLocaleString()} RWF`} icon={Wallet} />
        <StatsCard title="Total Spent" value={`${totalSpent.toLocaleString()} RWF`} icon={ArrowUp} />
        <StatsCard title="Transactions" value={pettyCash.length} icon={ArrowDown} />
      </div>
      <DataTable
        columns={[
          { key: "date", label: "Date" },
          { key: "description", label: "Description" },
          { key: "amount", label: "Amount (RWF)", render: (item) => ((item as Record<string, unknown>).amount as number).toLocaleString() },
          { key: "paidTo", label: "Paid To" },
          { key: "approvedBy", label: "Approved By" },
          { key: "balance", label: "Balance", render: (item) => ((item as Record<string, unknown>).balance as number).toLocaleString() },
        ]}
        data={pettyCash as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
