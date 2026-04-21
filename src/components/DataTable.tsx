import { useLocation, useNavigate } from "@tanstack/react-router";
import { FileDown, FilePlus2, Lock, Pencil, Printer, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getDemoUserById, getStoredUserId } from "../lib/auth";
import {
    inferEditableKeys,
    inferStatusKey,
    isValidTablePath,
    normalizeCellValue,
    normalizeTableRows,
    readTableMeta,
    readTableRows,
    writeTableMeta,
    writeTableRows,
    type TableCrudMeta,
} from "../lib/table-crud";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  enableAutoCrud?: boolean;
}

function sanitizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function isActionColumnKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return normalized === "actions" || normalized === "changestatus" || normalized === "_actions" || normalized === "_changestatus";
}

function createReportTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) {
    return "INADES Table Report";
  }

  const label = segments
    .map((segment) => segment.replace(/[-_]/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" • ");

  return `${label} Report`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, enableAutoCrud = true }: DataTableProps<T>) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = useMemo(() => getDemoUserById(getStoredUserId())?.role ?? "office", []);
  const canDelete = currentRole === "admin" || currentRole === "hr" || currentRole === "finance";
  const canChangeStatus = currentRole === "admin" || currentRole === "hr" || currentRole === "finance";

  const hasCustomActions = useMemo(
    () => columns.some((column) => column.key === "actions" || column.key === "changeStatus"),
    [columns],
  );
  const autoCrudEnabled = enableAutoCrud && !hasCustomActions;

  const tablePath = location.pathname;
  const [rows, setRows] = useState<T[]>(data);

  useEffect(() => {
    if (!autoCrudEnabled) {
      setRows(data);
      return;
    }

    if (!isValidTablePath(tablePath)) {
      setRows(data);
      return;
    }

    const fallbackMeta = readTableMeta(tablePath);
    const template = ((data[0] as Record<string, unknown>) ?? fallbackMeta?.template ?? {}) as Record<string, unknown>;

    const editableKeys = inferEditableKeys(template);
    const statusKey = inferStatusKey(editableKeys);
    const meta: TableCrudMeta = {
      editableKeys,
      statusKey,
      template,
    };
    writeTableMeta(tablePath, meta);

    const storedRows = readTableRows<T>(tablePath);
    if (!storedRows) {
      const normalizedFallback = normalizeTableRows(data, template);
      setRows(normalizedFallback);
      writeTableRows(tablePath, normalizedFallback);
      return;
    }

    const normalizedStored = normalizeTableRows(storedRows, template);
    setRows(normalizedStored);
    writeTableRows(tablePath, normalizedStored);
  }, [autoCrudEnabled, data, tablePath]);

  const persistRows = (nextRows: T[]) => {
    setRows(nextRows);
    if (autoCrudEnabled && isValidTablePath(tablePath)) {
      writeTableRows(tablePath, nextRows);
    }
  };

  const persistedMeta = useMemo(() => (isValidTablePath(tablePath) ? readTableMeta(tablePath) : null), [tablePath]);
  const sampleRow = ((data[0] as Record<string, unknown>) ?? persistedMeta?.template ?? {}) as Record<string, unknown>;
  const editableKeys = useMemo(() => inferEditableKeys(sampleRow), [sampleRow]);

  const statusKey = useMemo(
    () => inferStatusKey(editableKeys),
    [editableKeys],
  );
  const statusOptions = useMemo(() => {
    if (!statusKey) {
      return [];
    }

    const values = new Set<string>();
    rows.forEach((row) => {
      const value = row[statusKey];
      if (typeof value === "string" && value.trim()) {
        values.add(value);
      }
    });

    return Array.from(values);
  }, [rows, statusKey]);

  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ index: number; nextStatus: string } | null>(null);

  const handleGoToAdd = () => {
    if (!isValidTablePath(tablePath)) {
      toast.error("Unable to open add form for this table.");
      return;
    }

    navigate({
      to: "/table-editor/add",
      search: { table: tablePath },
    });
  };

  const handleGoToEdit = (index: number) => {
    if (!isValidTablePath(tablePath)) {
      toast.error("Unable to open edit form for this table.");
      return;
    }

    navigate({
      to: "/table-editor/edit",
      search: { table: tablePath, index: String(index) },
    });
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex === null) {
      return;
    }

    const nextRows = rows.filter((_, index) => index !== pendingDeleteIndex);
    persistRows(nextRows);
    setPendingDeleteIndex(null);
    toast.success("Record deleted successfully.");
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange || !statusKey) {
      return;
    }

    const nextRows = [...rows];
    const row = { ...(nextRows[pendingStatusChange.index] as Record<string, unknown>) };
    row[statusKey] = pendingStatusChange.nextStatus;
    nextRows[pendingStatusChange.index] = row as T;
    persistRows(nextRows);
    toast.success(`Status updated to ${pendingStatusChange.nextStatus}.`);
    setPendingStatusChange(null);
  };

  const rowsToRender = autoCrudEnabled ? rows : data;
  const reportTitle = useMemo(() => createReportTitle(tablePath), [tablePath]);

  const exportColumns = useMemo(() => {
    return columns.filter((column) => !isActionColumnKey(column.key));
  }, [columns]);

  const exportRows = useMemo(() => {
    return rowsToRender.map((item, index) => {
      return exportColumns.map((column) =>
        sanitizeValue(normalizeCellValue(item[column.key], column.key, sampleRow[column.key], index + 1)),
      );
    });
  }, [exportColumns, rowsToRender, sampleRow]);

  const handleExportPdf = async () => {
    if (!exportColumns.length) {
      toast.error("There are no exportable columns in this table.");
      return;
    }

    if (!exportRows.length) {
      toast.error("There are no records to export.");
      return;
    }

    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
      const autoTable = autoTableModule.default;

      const isLandscape = exportColumns.length > 6;
      const doc = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait" });
      const createdAt = new Date();

      doc.setFontSize(14);
      doc.text(reportTitle, 14, 14);
      doc.setFontSize(9);
      doc.text(`Generated: ${createdAt.toLocaleString()}`, 14, 20);

      autoTable(doc, {
        head: [exportColumns.map((column) => column.label)],
        body: exportRows,
        startY: 26,
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: [242, 140, 0] },
      });

      const fileDate = createdAt.toISOString().slice(0, 10);
      const fileSlug = reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      doc.save(`${fileSlug || "table-report"}-${fileDate}.pdf`);
      toast.success("PDF report exported successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF report.");
    }
  };

  const handlePrintReport = () => {
    if (!exportColumns.length) {
      toast.error("There are no printable columns in this table.");
      return;
    }

    const printableWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printableWindow) {
      toast.error("Unable to open print window. Please allow pop-ups and try again.");
      return;
    }

    const createdAt = new Date().toLocaleString();
    const headHtml = exportColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const bodyHtml = exportRows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");

    printableWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(reportTitle)}</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #1f2937; }
            h1 { margin: 0 0 6px; font-size: 20px; color: #F28C00; }
            p { margin: 0 0 14px; color: #4b5563; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; text-align: left; padding: 8px; font-size: 12px; }
            th { background: #F28C00; color: #FFFFFF; font-weight: 700; }
            tr:nth-child(even) { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(reportTitle)}</h1>
          <p>Generated: ${escapeHtml(createdAt)} • Records: ${exportRows.length}</p>
          <table>
            <thead>
              <tr>${headHtml}</tr>
            </thead>
            <tbody>
              ${bodyHtml}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printableWindow.document.close();
    toast.success("Print preview opened.");
  };

  const autoActionColumns: Column<T>[] = autoCrudEnabled
    ? [
        ...(statusKey
          ? [
              {
                key: "_changeStatus",
                label: "Change Status",
                render: (item: T) => {
                  const rowIndex = rowsToRender.indexOf(item);
                  const currentValue = sanitizeValue((item as Record<string, unknown>)[statusKey]);

                  if (!canChangeStatus) {
                    return (
                      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    );
                  }

                  return (
                    <select
                      value={currentValue}
                      onChange={(event) => {
                        const nextStatus = event.target.value;
                        if (!nextStatus || nextStatus === currentValue) {
                          return;
                        }

                        setPendingStatusChange({ index: rowIndex, nextStatus });
                      }}
                      title={`Change status for row ${rowIndex + 1}`}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {(statusOptions.length ? statusOptions : [currentValue]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );
                },
              } as Column<T>,
            ]
          : []),
        {
          key: "_actions",
          label: "Actions",
          render: (item: T) => {
            const rowIndex = rowsToRender.indexOf(item);
            return (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleGoToEdit(rowIndex)}
                  className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
                  title="Edit record"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                {canDelete ? (
                  <button
                    onClick={() => setPendingDeleteIndex(rowIndex)}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    title="Delete record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>
            );
          },
        },
      ]
    : [];

  const columnsToRender = autoCrudEnabled ? [...columns, ...autoActionColumns] : columns;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          {autoCrudEnabled
            ? "Manage records with add, edit, delete, and status controls."
            : "Export this report as PDF or open a print-ready view."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#F28C00] bg-[#F28C00] px-3 py-1.5 text-xs font-medium text-[#FFFFFF] hover:bg-[#CC7600]"
            title="Export as PDF report"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </button>
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#F28C00]/40 bg-[#F28C00]/10 px-3 py-1.5 text-xs font-medium text-[#000000] hover:bg-[#F28C00]/20"
            title="Print report"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          {autoCrudEnabled && (
            <button
              onClick={handleGoToAdd}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              title="Add record"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columnsToRender.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowsToRender.map((item, i) => (
              <tr
                key={i}
                className={`transition-colors hover:bg-muted/30 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columnsToRender.map((col) => {
                  const rendered = col.render
                    ? col.render(item)
                    : sanitizeValue(normalizeCellValue(item[col.key], col.key, sampleRow[col.key], i + 1));
                  const showFallback = rendered === null || rendered === undefined || rendered === "";
                  return (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3 text-foreground">
                      {showFallback ? <span className="text-muted-foreground">—</span> : rendered}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rowsToRender.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No records found</div>
      )}

      <AlertDialog open={pendingDeleteIndex !== null} onOpenChange={(open) => !open && setPendingDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Do you want to delete this record?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(pendingStatusChange)} onOpenChange={(open) => !open && setPendingStatusChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm status change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusChange ? `Change status to \"${pendingStatusChange.nextStatus}\"?` : "Are you sure you want to change the status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
