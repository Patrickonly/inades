import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import {
    castFormValue,
    inferEditableKeys,
    inferStatusKey,
    isValidTablePath,
    readTableMeta,
    readTableRows,
    toFormString,
    writeTableMeta,
    writeTableRows,
} from "../../lib/table-crud";

type EditSearch = {
  table?: string;
  index?: string;
};

export const Route = createFileRoute("/table-editor/edit")({
  validateSearch: (search): EditSearch => ({
    table: typeof search.table === "string" ? search.table : undefined,
    index: typeof search.index === "string" ? search.index : undefined,
  }),
  component: EditTableRecordPage,
});

function titleFromKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (value) => value.toUpperCase());
}

function EditTableRecordPage() {
  const { table, index } = Route.useSearch();
  const tablePath = isValidTablePath(table) ? table : undefined;
  const rowIndex = Number(index ?? "-1");

  const rows = useMemo(() => (tablePath ? readTableRows<Record<string, unknown>>(tablePath) ?? [] : []), [tablePath]);
  const meta = useMemo(() => (tablePath ? readTableMeta(tablePath) : null), [tablePath]);

  const template = useMemo(() => {
    return (meta?.template ?? rows[0] ?? {}) as Record<string, unknown>;
  }, [meta?.template, rows]);

  const editableKeys = useMemo(() => {
    if (meta?.editableKeys?.length) {
      return meta.editableKeys;
    }

    return inferEditableKeys(template);
  }, [meta?.editableKeys, template]);

  const statusKey = useMemo(() => meta?.statusKey ?? inferStatusKey(editableKeys), [meta?.statusKey, editableKeys]);

  const row = rowIndex >= 0 ? rows[rowIndex] : undefined;

  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    editableKeys.forEach((key) => {
      values[key] = toFormString((row ?? {})[key]);
    });
    return values;
  });

  const statusOptions = useMemo(() => {
    if (!statusKey) {
      return [];
    }

    const values = new Set<string>();
    rows.forEach((r) => {
      const value = r[statusKey];
      if (typeof value === "string" && value.trim()) {
        values.add(value);
      }
    });

    return Array.from(values);
  }, [rows, statusKey]);

  const handleSave = () => {
    if (!tablePath || rowIndex < 0 || !row) {
      toast.error("Unable to edit this record.");
      return;
    }

    const nextRow: Record<string, unknown> = { ...row };

    editableKeys.forEach((key) => {
      nextRow[key] = castFormValue(formValues[key] ?? "", template[key], key);
    });

    const nextRows = [...rows];
    nextRows[rowIndex] = nextRow;

    writeTableRows(tablePath, nextRows);
    writeTableMeta(tablePath, {
      editableKeys,
      statusKey,
      template,
    });

    toast.success("Record updated successfully.");
    window.location.assign(tablePath);
  };

  if (!tablePath || rowIndex < 0 || !row) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Record not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The selected record could not be found for editing.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Edit Record"
        description={`Update the selected record for ${tablePath}.`}
      />

      <div className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {editableKeys.map((key) => {
            const lowerKey = key.toLowerCase();
            const label = titleFromKey(key);
            const value = formValues[key] ?? "";
            const isStatusField = Boolean(statusKey && key === statusKey && statusOptions.length);
            const isDate = ["date", "from", "to", "deadline", "departure", "return", "purchasedate", "lastservice", "incidentdate"].some((token) =>
              lowerKey.includes(token),
            );
            const isLongText = ["reason", "description", "recommendation", "purpose", "action", "title"].some((token) => lowerKey.includes(token));

            return (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                {isStatusField ? (
                  <select
                    value={value}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, [key]: event.target.value }))}
                    title={label}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : isLongText ? (
                  <textarea
                    rows={3}
                    value={value}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, [key]: event.target.value }))}
                    title={label}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                ) : (
                  <input
                    type={isDate ? "date" : "text"}
                    value={value}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, [key]: event.target.value }))}
                    title={label}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => window.location.assign(tablePath)}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
