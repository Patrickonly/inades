import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";

export const Route = createFileRoute("/finance/auctions")({ component: AuctionsPage });

const auctions = [
  { id: "AUC-001", item: "Old Office Furniture (Lot)", startingBid: 150000, currentBid: 280000, bidders: 5, closingDate: "2026-05-01", status: "Open" },
  { id: "AUC-002", item: "Decommissioned Printer", startingBid: 50000, currentBid: 75000, bidders: 3, closingDate: "2026-04-25", status: "Open" },
  { id: "AUC-003", item: "Old Vehicle – Toyota Corolla 2015", startingBid: 3500000, currentBid: 4200000, bidders: 8, closingDate: "2026-04-20", status: "Closed" },
];

function AuctionsPage() {
  return (
    <AppLayout>
      <PageHeader title="Auctions" description="Manage auction processes for disposing organizational assets" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New Auction</button>} />
      <DataTable
        columns={[
          { key: "id", label: "Auction #" },
          { key: "item", label: "Item" },
          { key: "startingBid", label: "Starting Bid", render: (item) => ((item as Record<string, unknown>).startingBid as number).toLocaleString() },
          { key: "currentBid", label: "Current Bid", render: (item) => ((item as Record<string, unknown>).currentBid as number).toLocaleString() },
          { key: "bidders", label: "Bidders" },
          { key: "closingDate", label: "Closing Date" },
          { key: "status", label: "Status", render: (item) => <StatusBadge status={(item as Record<string, unknown>).status as string} /> },
        ]}
        data={auctions as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
