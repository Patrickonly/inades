import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/PageHeader";
import {
    castFormValue,
    getDummyValueForKey,
    inferEditableKeys,
    inferStatusKey,
    isValidTablePath,
    readTableMeta,
    readTableRows,
    writeTableMeta,
    writeTableRows,
} from "../../lib/table-crud";

type AddSearch = {
  table?: string;
};

export const Route = createFileRoute("/table-editor/add")({
  validateSearch: (search): AddSearch => ({
    table: typeof search.table === "string" ? search.table : undefined,
  }),
  component: AddTableRecordPage,
});

function titleFromKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (value) => value.toUpperCase());
}

function isDateKey(lowerKey: string): boolean {
  return ["date", "from", "to", "deadline", "departure", "return", "purchasedate", "lastservice", "incidentdate"].some((token) =>
    lowerKey.includes(token),
  );
}

function isNumericKey(lowerKey: string): boolean {
  return ["amount", "cost", "budget", "price", "salary", "allowances", "deductions", "value", "expenses", "mileage", "liters", "days", "participants", "applications", "bids", "quantity", "total", "score", "year"].some((token) =>
    lowerKey.includes(token),
  );
}

function isOptionalKey(lowerKey: string): boolean {
  return ["id", "reference", "status", "createdat", "updatedat", "visibilityroles", "anonymous", "is", "active", "locked"].some((token) =>
    lowerKey === token || lowerKey.startsWith(token),
  );
}

function AddTableRecordPage() {
  const { table } = Route.useSearch();
  const tablePath = isValidTablePath(table) ? table : undefined;

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

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialValues: Record<string, string> = {};
    editableKeys.forEach((key, index) => {
      if (statusKey && key === statusKey && statusOptions.length) {
        initialValues[key] = statusOptions[0];
        return;
      }

      initialValues[key] = String(getDummyValueForKey(key, template[key], rows.length + index + 1));
    });

    setFormValues(initialValues);
  }, [editableKeys, rows.length, statusKey, statusOptions, template]);

  const handleSave = () => {
    if (!tablePath) {
      toast.error("Invalid table path.");
      return;
    }

    if (!editableKeys.length) {
      toast.error("This table has no editable fields.");
      return;
    }

    const validationErrors: string[] = [];

    editableKeys.forEach((key) => {
      const lowerKey = key.toLowerCase();
      const rawValue = formValues[key] ?? "";
      const value = rawValue.trim();
      const label = titleFromKey(key);

      if (!value && !isOptionalKey(lowerKey)) {
        validationErrors.push(`${label} is required.`);
        return;
      }

      if (!value) {
        return;
      }

      if (lowerKey.includes("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        validationErrors.push(`${label} must be a valid email address.`);
      }

      if (isDateKey(lowerKey)) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          validationErrors.push(`${label} must be a valid date.`);
        }
      }

      if (isNumericKey(lowerKey)) {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
          validationErrors.push(`${label} must be a valid number.`);
        }
      }
    });

    const fromValue = formValues.from?.trim();
    const toValue = formValues.to?.trim();
    if (fromValue && toValue) {
      const fromDate = new Date(fromValue);
      const toDate = new Date(toValue);
      if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime()) && fromDate.getTime() > toDate.getTime()) {
        validationErrors.push("From date cannot be after To date.");
      }
    }

    if (validationErrors.length) {
      toast.error(validationErrors[0]);
      return;
    }

    const nextRow: Record<string, unknown> = { ...template };

    editableKeys.forEach((key) => {
      if (key === "id" && !(formValues[key] ?? "").trim()) {
        nextRow[key] = `${tablePath.split("/").filter(Boolean).join("-")}-${Date.now()}`;
        return;
      }

      nextRow[key] = castFormValue(formValues[key] ?? "", template[key], key);
    });

    const nextRows = [nextRow, ...rows];
    writeTableRows(tablePath, nextRows);
    writeTableMeta(tablePath, {
      editableKeys,
      statusKey,
      template,
    });

    toast.success("Record added successfully.");
    window.location.assign(tablePath);
  };

  if (!tablePath) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Invalid table</h2>
          <p className="mt-2 text-sm text-muted-foreground">The add form could not determine which table to update.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Add Record"
        description={`Create a new record for ${tablePath}.`}
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
            Save Record
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
