export type TableCrudMeta = {
  editableKeys: string[];
  statusKey?: string;
  template: Record<string, unknown>;
};

const EXCLUDED_EDIT_KEYS = new Set(["createdAt", "updatedAt", "visibilityRoles"]);

const DUMMY_NAMES = [
  "Jean Baptiste Habimana",
  "Marie Claire Uwimana",
  "Emmanuel Nsengiyumva",
  "Claudine Mukamana",
  "Francine Ingabire",
  "Théogène Ndayisaba",
  "Vestine Nyiransabimana",
  "Aline Mukeshimana",
];

const DUMMY_DEPARTMENTS = ["Programs", "Finance", "Human Resources", "Operations", "Administration", "IT"];
const DUMMY_LOCATIONS = ["Kigali", "Huye", "Ngoma", "Nyamasheke", "Musanze"];
const DUMMY_CATEGORIES = ["Operations", "Administration", "Training", "IT Equipment", "Services", "Programs"];
const DUMMY_PURPOSES = [
  "Field monitoring visit",
  "Budget review",
  "Training facilitation",
  "Quarterly audit follow-up",
  "Procurement verification",
];
const DUMMY_STATUSES = ["Pending", "Approved", "Submitted", "In Progress", "Under Review"];

function pickFrom<T>(items: T[], seed: number): T {
  if (!items.length) {
    throw new Error("Cannot pick from an empty array");
  }

  return items[Math.abs(seed) % items.length];
}

function keySeed(key: string, rowSeed = 0): number {
  let hash = rowSeed + 7;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 100000;
  }
  return hash;
}

function toIsoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function keyPrefix(key: string): string {
  const compact = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return compact.slice(0, 3) || "REC";
}

export function getDummyValueForKey(key: string, sampleValue?: unknown, rowSeed = 0): unknown {
  const lowerKey = key.toLowerCase();
  const seed = keySeed(lowerKey, rowSeed);

  if (typeof sampleValue === "boolean") {
    return false;
  }

  if (lowerKey.includes("status")) {
    return pickFrom(DUMMY_STATUSES, seed);
  }

  if (lowerKey === "id" || lowerKey.endsWith("id") || lowerKey.includes("ref") || lowerKey.includes("reference")) {
    return `${keyPrefix(key)}-2026-${String((seed % 900) + 100).padStart(3, "0")}`;
  }

  if (lowerKey.includes("date") || ["from", "to", "departure", "return", "deadline", "lastservice", "purchasedate", "incidentdate"].includes(lowerKey)) {
    return toIsoDate((seed % 60) - 30);
  }

  if (lowerKey.includes("email")) {
    return `user${(seed % 80) + 1}@inades.org.rw`;
  }

  if (lowerKey.includes("phone")) {
    return `+250 78${String((seed % 90) + 10)} ${String((seed % 900) + 100)} ${String((seed % 900) + 100)}`;
  }

  if (lowerKey.includes("name") || lowerKey.includes("employee") || lowerKey.includes("officer") || lowerKey.includes("driver") || lowerKey.includes("requestedby") || lowerKey.includes("approvedby") || lowerKey.includes("assignedto") || lowerKey.includes("responsible") || lowerKey.includes("paidto") || lowerKey.includes("user")) {
    return pickFrom(DUMMY_NAMES, seed);
  }

  if (lowerKey.includes("department")) {
    return pickFrom(DUMMY_DEPARTMENTS, seed);
  }

  if (lowerKey.includes("location") || lowerKey.includes("destination") || lowerKey.includes("station")) {
    return pickFrom(DUMMY_LOCATIONS, seed);
  }

  if (lowerKey.includes("category") || lowerKey.includes("type")) {
    return pickFrom(DUMMY_CATEGORIES, seed);
  }

  if (lowerKey.includes("purpose")) {
    return pickFrom(DUMMY_PURPOSES, seed);
  }

  if (lowerKey.includes("plate")) {
    return `RAD ${String((seed % 900) + 100)} ${String.fromCharCode(65 + (seed % 26))}`;
  }

  if (lowerKey.includes("currency")) {
    return "RWF";
  }

  if (lowerKey.includes("week")) {
    return "Apr 14-18, 2026";
  }

  if (typeof sampleValue === "number" || ["amount", "cost", "budget", "price", "salary", "allowances", "deductions", "value", "expenses", "mileage", "liters", "days", "participants", "applications", "bids", "quantity", "total", "score", "year"].some((token) => lowerKey.includes(token))) {
    if (lowerKey.includes("year")) {
      return 2026;
    }

    if (lowerKey.includes("days") || lowerKey.includes("participants") || lowerKey.includes("applications") || lowerKey.includes("bids") || lowerKey.includes("quantity") || lowerKey.includes("score") || lowerKey.includes("total")) {
      return (seed % 25) + 1;
    }

    if (lowerKey.includes("liters")) {
      return (seed % 70) + 20;
    }

    if (lowerKey.includes("mileage")) {
      return (seed % 120000) + 5000;
    }

    return ((seed % 250) + 15) * 1000;
  }

  if (lowerKey.includes("description") || lowerKey.includes("reason") || lowerKey.includes("recommendation") || lowerKey.includes("action")) {
    return "System-generated sample detail for demonstration.";
  }

  if (lowerKey.includes("title") || lowerKey.includes("subject") || lowerKey.includes("item") || lowerKey.includes("source")) {
    return `Sample ${key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").trim()}`;
  }

  if (typeof sampleValue === "string") {
    return `Sample ${key}`;
  }

  return "Sample Value";
}

export function getTableDataStorageKey(tablePath: string): string {
  return `inades.table-data:${tablePath}`;
}

export function getTableMetaStorageKey(tablePath: string): string {
  return `inades.table-meta:${tablePath}`;
}

export function isValidTablePath(path?: string): path is string {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//");
}

export function inferEditableKeys(template: Record<string, unknown>): string[] {
  return Object.keys(template).filter((key) => !EXCLUDED_EDIT_KEYS.has(key));
}

export function inferStatusKey(keys: string[]): string | undefined {
  return keys.find((key) => key.toLowerCase().includes("status"));
}

export function normalizeCellValue(value: unknown, key?: string, sampleValue?: unknown, rowSeed = 0): unknown {
  if (value !== null && value !== undefined && value !== "" && value !== "N/A") {
    return value;
  }

  return getDummyValueForKey(key ?? "", sampleValue, rowSeed);
}

export function normalizeTableRows<T extends Record<string, unknown>>(
  rows: T[],
  template: Record<string, unknown>,
): T[] {
  const keys = Object.keys(template);

  return rows.map((row, rowIndex) => {
    const normalized: Record<string, unknown> = { ...row };

    keys.forEach((key) => {
      normalized[key] =
        normalized[key] !== null && normalized[key] !== undefined && normalized[key] !== "" && normalized[key] !== "N/A"
          ? normalized[key]
          : getDummyValueForKey(key, template[key], rowIndex + 1);
    });

    return normalized as T;
  });
}

export function readTableRows<T extends Record<string, unknown>>(tablePath: string): T[] | null {
  if (typeof window === "undefined" || !isValidTablePath(tablePath)) {
    return null;
  }

  const raw = localStorage.getItem(getTableDataStorageKey(tablePath));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeTableRows<T extends Record<string, unknown>>(tablePath: string, rows: T[]): void {
  if (typeof window === "undefined" || !isValidTablePath(tablePath)) {
    return;
  }

  localStorage.setItem(getTableDataStorageKey(tablePath), JSON.stringify(rows));
}

export function readTableMeta(tablePath: string): TableCrudMeta | null {
  if (typeof window === "undefined" || !isValidTablePath(tablePath)) {
    return null;
  }

  const raw = localStorage.getItem(getTableMetaStorageKey(tablePath));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as TableCrudMeta;
    if (!parsed || typeof parsed !== "object" || !parsed.template) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeTableMeta(tablePath: string, meta: TableCrudMeta): void {
  if (typeof window === "undefined" || !isValidTablePath(tablePath)) {
    return;
  }

  localStorage.setItem(getTableMetaStorageKey(tablePath), JSON.stringify(meta));
}

export function toFormString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function castFormValue(rawValue: string, sampleValue: unknown, key: string): unknown {
  const value = rawValue.trim();

  if (typeof sampleValue === "number") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (typeof sampleValue === "boolean") {
    return value === "true";
  }

  if (!value) {
    return getDummyValueForKey(key, sampleValue, 1);
  }

  return value;
}
