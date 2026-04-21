const statusColors: Record<string, string> = {
  active: "bg-success/15 text-success-foreground border-success/20",
  approved: "bg-success/15 text-success-foreground border-success/20",
  completed: "bg-success/15 text-success-foreground border-success/20",
  submitted: "bg-success/15 text-success-foreground border-success/20",
  paid: "bg-success/15 text-success-foreground border-success/20",
  open: "bg-primary/15 text-primary border-primary/20",
  pending: "bg-warning/15 text-warning-foreground border-warning/20",
  "under review": "bg-warning/15 text-warning-foreground border-warning/20",
  planned: "bg-accent/15 text-accent-foreground border-accent/20",
  upcoming: "bg-primary/15 text-primary border-primary/20",
  "in progress": "bg-primary/15 text-primary border-primary/20",
  "in maintenance": "bg-warning/15 text-warning-foreground border-warning/20",
  "on leave": "bg-warning/15 text-warning-foreground border-warning/20",
  rejected: "bg-destructive/15 text-destructive border-destructive/20",
  closed: "bg-muted text-muted-foreground border-border",
  draft: "bg-muted text-muted-foreground border-border",
  awarded: "bg-success/15 text-success-foreground border-success/20",
  high: "bg-destructive/15 text-destructive border-destructive/20",
  medium: "bg-warning/15 text-warning-foreground border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
  good: "bg-success/15 text-success-foreground border-success/20",
  fair: "bg-warning/15 text-warning-foreground border-warning/20",
  excellent: "bg-success/15 text-success-foreground border-success/20",
  "very good": "bg-primary/15 text-primary border-primary/20",
};

export default function StatusBadge({ status }: { status?: string | null }) {
  const normalizedStatus = typeof status === "string" ? status.trim() : "";
  const lookupKey = normalizedStatus.toLowerCase();
  const color = statusColors[lookupKey] || "bg-muted text-muted-foreground border-border";
  const displayStatus = normalizedStatus || "Unknown";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
      {displayStatus}
    </span>
  );
}
