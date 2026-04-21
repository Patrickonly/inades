import { getDemoUserById, getStoredUserId, type UserRole } from "./auth";

export type FraudStatus = "Draft" | "Submitted" | "Under Investigation" | "Resolved" | "Closed";
export type FraudPriority = "High" | "Medium" | "Low";

export type FraudReport = {
  id: string;
  reference: string;
  type: string;
  subject: string;
  description: string;
  incidentDate: string;
  reportedBy: string;
  department: string;
  anonymous: boolean;
  status: FraudStatus;
  priority: FraudPriority;
  createdByRole: UserRole;
  visibilityRoles: UserRole[];
  createdAt: string;
  updatedAt: string;
};

const FRAUD_REPORTS_STORAGE_KEY = "inades.fraud-reports";

export const fraudStatusOptions: FraudStatus[] = [
  "Draft",
  "Submitted",
  "Under Investigation",
  "Resolved",
  "Closed",
];

export const fraudPriorityOptions: FraudPriority[] = ["High", "Medium", "Low"];

const seedFraudReports: FraudReport[] = [
  {
    id: "fr-001",
    reference: "FR-2026-001",
    type: "Financial Irregularity",
    subject: "Invoice mismatch for fuel procurement",
    description: "Fuel invoice amount does not match approved request and receipts.",
    incidentDate: "2026-03-10",
    reportedBy: "Anonymous",
    department: "Finance",
    anonymous: true,
    status: "Resolved",
    priority: "High",
    createdByRole: "finance",
    visibilityRoles: ["admin", "finance"],
    createdAt: "2026-03-10T09:15:00.000Z",
    updatedAt: "2026-03-18T11:30:00.000Z",
  },
  {
    id: "fr-002",
    reference: "FR-2026-002",
    type: "Misconduct",
    subject: "Unauthorized use of project vehicle",
    description: "Vehicle assigned for mission was used outside approved itinerary.",
    incidentDate: "2026-03-25",
    reportedBy: "Vestine Nyiransabimana",
    department: "Operations",
    anonymous: false,
    status: "Under Investigation",
    priority: "Medium",
    createdByRole: "office",
    visibilityRoles: ["admin", "finance", "office"],
    createdAt: "2026-03-25T14:00:00.000Z",
    updatedAt: "2026-04-02T08:22:00.000Z",
  },
  {
    id: "fr-003",
    reference: "FR-2026-003",
    type: "Fraud",
    subject: "Duplicate beneficiary payment",
    description: "Same beneficiary appears twice in payment batch PAY-2026-011.",
    incidentDate: "2026-04-05",
    reportedBy: "Marie Claire Uwimana",
    department: "Finance",
    anonymous: false,
    status: "Under Investigation",
    priority: "High",
    createdByRole: "finance",
    visibilityRoles: ["admin", "finance"],
    createdAt: "2026-04-05T10:30:00.000Z",
    updatedAt: "2026-04-06T09:15:00.000Z",
  },
  {
    id: "fr-004",
    reference: "FR-2026-004",
    type: "Sexual Harassment",
    subject: "Inappropriate comments during field mission",
    description: "Staff member reported repeated inappropriate comments.",
    incidentDate: "2026-04-08",
    reportedBy: "Anonymous",
    department: "Programs",
    anonymous: true,
    status: "Submitted",
    priority: "High",
    createdByRole: "hr",
    visibilityRoles: ["admin", "hr"],
    createdAt: "2026-04-08T16:10:00.000Z",
    updatedAt: "2026-04-08T16:10:00.000Z",
  },
  {
    id: "fr-005",
    reference: "FR-2026-005",
    type: "Misconduct",
    subject: "Late submission of procurement records",
    description: "Procurement documents submitted after deadline without explanation.",
    incidentDate: "2026-04-09",
    reportedBy: "Claudine Mukamana",
    department: "Administration",
    anonymous: false,
    status: "Submitted",
    priority: "Low",
    createdByRole: "hr",
    visibilityRoles: ["admin", "hr", "finance"],
    createdAt: "2026-04-09T08:45:00.000Z",
    updatedAt: "2026-04-09T08:45:00.000Z",
  },
  {
    id: "fr-006",
    reference: "FR-2026-006",
    type: "Fraud",
    subject: "Asset tag removal from laptop",
    description: "Laptop found without asset tag in Kigali office.",
    incidentDate: "2026-04-10",
    reportedBy: "Théogène Ndayisaba",
    department: "IT",
    anonymous: false,
    status: "Draft",
    priority: "Medium",
    createdByRole: "office",
    visibilityRoles: ["admin", "finance", "office"],
    createdAt: "2026-04-10T13:12:00.000Z",
    updatedAt: "2026-04-10T13:12:00.000Z",
  },
  {
    id: "fr-007",
    reference: "FR-2026-007",
    type: "Financial Irregularity",
    subject: "Unapproved petty cash expense",
    description: "Petty cash reimbursement claimed without receipt.",
    incidentDate: "2026-04-11",
    reportedBy: "Jean Bosco Murenzi",
    department: "Finance",
    anonymous: false,
    status: "Submitted",
    priority: "Medium",
    createdByRole: "finance",
    visibilityRoles: ["admin", "finance"],
    createdAt: "2026-04-11T09:45:00.000Z",
    updatedAt: "2026-04-11T09:45:00.000Z",
  },
  {
    id: "fr-008",
    reference: "FR-2026-008",
    type: "Misconduct",
    subject: "Absenteeism during project training",
    description: "Facilitator absent for two sessions without notice.",
    incidentDate: "2026-04-12",
    reportedBy: "Grace Uwase",
    department: "Human Resources",
    anonymous: false,
    status: "Closed",
    priority: "Low",
    createdByRole: "hr",
    visibilityRoles: ["admin", "hr"],
    createdAt: "2026-04-12T11:05:00.000Z",
    updatedAt: "2026-04-14T17:22:00.000Z",
  },
  {
    id: "fr-009",
    reference: "FR-2026-009",
    type: "Fraud",
    subject: "Suspicious stock adjustments",
    description: "Stock quantity changed manually without approval trail.",
    incidentDate: "2026-04-13",
    reportedBy: "Aline Mukeshimana",
    department: "Operations",
    anonymous: false,
    status: "Under Investigation",
    priority: "High",
    createdByRole: "office",
    visibilityRoles: ["admin", "finance", "office"],
    createdAt: "2026-04-13T12:40:00.000Z",
    updatedAt: "2026-04-13T12:40:00.000Z",
  },
  {
    id: "fr-010",
    reference: "FR-2026-010",
    type: "Sexual Harassment",
    subject: "Unsafe communication in field team",
    description: "Repeated unsafe communication reported by field assistant.",
    incidentDate: "2026-04-14",
    reportedBy: "Anonymous",
    department: "Programs",
    anonymous: true,
    status: "Submitted",
    priority: "High",
    createdByRole: "office",
    visibilityRoles: ["admin", "hr", "office"],
    createdAt: "2026-04-14T07:20:00.000Z",
    updatedAt: "2026-04-14T07:20:00.000Z",
  },
];

function sortByRecent(data: FraudReport[]): FraudReport[] {
  return [...data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function getStorageData(): FraudReport[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(FRAUD_REPORTS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as FraudReport[];
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getFraudReports(): FraudReport[] {
  const storageData = getStorageData();
  if (!storageData) {
    return sortByRecent(seedFraudReports);
  }

  return sortByRecent(storageData);
}

export function saveFraudReports(reports: FraudReport[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(FRAUD_REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function initializeFraudReports(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!getStorageData()) {
    saveFraudReports(seedFraudReports);
  }
}

export function getCurrentUserRole(): UserRole {
  const user = getDemoUserById(getStoredUserId());
  return user?.role ?? "office";
}

function nextReferenceNumber(reports: FraudReport[]): string {
  const max = reports.reduce((acc, report) => {
    const n = Number(report.reference.split("-").at(-1) ?? 0);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);

  return `FR-2026-${String(max + 1).padStart(3, "0")}`;
}

function defaultVisibility(createdByRole: UserRole): UserRole[] {
  const set = new Set<UserRole>(["admin", "finance", createdByRole]);
  if (createdByRole === "hr") {
    set.add("hr");
  }

  return Array.from(set);
}

export type FraudReportInput = {
  type: string;
  subject: string;
  description: string;
  incidentDate: string;
  reportedBy: string;
  department: string;
  anonymous: boolean;
  priority: FraudPriority;
  createdByRole: UserRole;
};

export function createFraudReport(input: FraudReportInput): FraudReport {
  const reports = getFraudReports();
  const now = new Date().toISOString();

  const report: FraudReport = {
    id: `fr-${Math.random().toString(36).slice(2, 10)}`,
    reference: nextReferenceNumber(reports),
    type: input.type,
    subject: input.subject,
    description: input.description,
    incidentDate: input.incidentDate,
    reportedBy: input.anonymous ? "Anonymous" : input.reportedBy,
    department: input.department,
    anonymous: input.anonymous,
    status: "Submitted",
    priority: input.priority,
    createdByRole: input.createdByRole,
    visibilityRoles: defaultVisibility(input.createdByRole),
    createdAt: now,
    updatedAt: now,
  };

  saveFraudReports([report, ...reports]);
  return report;
}

export function getFraudReportById(reportId: string): FraudReport | null {
  return getFraudReports().find((report) => report.id === reportId) ?? null;
}

export function updateFraudReport(reportId: string, updates: Partial<FraudReport>): FraudReport | null {
  const reports = getFraudReports();
  const index = reports.findIndex((report) => report.id === reportId);
  if (index === -1) {
    return null;
  }

  const updated: FraudReport = {
    ...reports[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const next = [...reports];
  next[index] = updated;
  saveFraudReports(next);
  return updated;
}

export function setFraudReportStatus(reportId: string, status: FraudStatus): FraudReport | null {
  return updateFraudReport(reportId, { status });
}

export function deleteFraudReport(reportId: string): void {
  const reports = getFraudReports().filter((report) => report.id !== reportId);
  saveFraudReports(reports);
}

export function getRoleVisibleFraudReports(role: UserRole): FraudReport[] {
  return getFraudReports().filter((report) => report.visibilityRoles.includes(role));
}
