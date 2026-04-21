import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { stockItems } from "../../lib/dummy-data";

export const Route = createFileRoute("/finance/stock")({ component: StockPage });

function StockPage() {
  return (
    <AppLayout>
      <PageHeader title="Stock Management" description="Manage inventory and stock levels" actions={<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Add Item</button>} />
      <DataTable
        columns={[
          { key: "item", label: "Item" },
          { key: "category", label: "Category" },
          { key: "quantity", label: "Qty", render: (item) => {
            const r = item as Record<string, unknown>;
            const qty = r.quantity as number;
            const reorder = r.reorderLevel as number;
            return <span className={qty <= reorder ? "font-semibold text-destructive" : ""}>{qty}</span>;
          }},
          { key: "reorderLevel", label: "Reorder Level" },
          { key: "unitPrice", label: "Unit Price (RWF)", render: (item) => ((item as Record<string, unknown>).unitPrice as number).toLocaleString() },
          { key: "location", label: "Location" },
        ]}
        data={stockItems as unknown as Record<string, unknown>[]}
      />
    </AppLayout>
  );
}
