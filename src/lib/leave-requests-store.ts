import { getDemoUserById, getStoredUserId, type UserRole } from "./auth";

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type LeaveRequest = {
  id: string;
  reference: string;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  createdByRole: UserRole;
  visibilityRoles: UserRole[];
  createdAt: string;
  updatedAt: string;
};

const LEAVE_REQUESTS_STORAGE_KEY = "inades.leave-requests";

export const leaveStatusOptions: LeaveStatus[] = ["Pending", "Approved", "Rejected", "Cancelled"];

export const leaveTypeOptions = [
  "Annual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Study Leave",
  "Compassionate Leave",
  "Unpaid Leave",
] as const;

const seedLeaveRequests: LeaveRequest[] = [
  {
    id: "lr-001",
    reference: "LEV-2026-001",
    employee: "Patrick Niyonzima",
    type: "Annual Leave",
    from: "2026-04-10",
    to: "2026-04-24",
    days: 10,
    status: "Approved",
    reason: "Family vacation",
    createdByRole: "office",
    visibilityRoles: ["admin", "hr", "office"],
    createdAt: "2026-04-03T08:15:00.000Z",
    updatedAt: "2026-04-05T10:25:00.000Z",
  },
  {
    id: "lr-002",
    reference: "LEV-2026-002",
    employee: "Marie Claire Uwimana",
    type: "Sick Leave",
    from: "2026-04-12",
    to: "2026-04-14",
    days: 2,
    status: "Approved",
    reason: "Medical appointment",
    createdByRole: "finance",
    visibilityRoles: ["admin", "hr"],
    createdAt: "2026-04-06T07:40:00.000Z",
    updatedAt: "2026-04-07T09:00:00.000Z",
  },
  {
    id: "lr-003",
    reference: "LEV-2026-003",
    employee: "Emmanuel Nsengiyumva",
    type: "Annual Leave",
    from: "2026-05-01",
    to: "2026-05-05",
    days: 4,
    status: "Pending",
    reason: "Personal matters",
    createdByRole: "office",
    visibilityRoles: ["admin", "hr", "office"],
    createdAt: "2026-04-08T14:05:00.000Z",
    updatedAt: "2026-04-08T14:05:00.000Z",
  },
  {
    id: "lr-004",
    reference: "LEV-2026-004",
    employee: "Francine Ingabire",
    type: "Maternity Leave",
    from: "2026-06-01",
    to: "2026-08-31",
    days: 90,
    status: "Pending",
    reason: "Maternity",
    createdByRole: "hr",
    visibilityRoles: ["admin", "hr"],
    createdAt: "2026-04-09T11:22:00.000Z",
    updatedAt: "2026-04-09T11:22:00.000Z",
  },
  {
    id: "lr-005",
    reference: "LEV-2026-005",
    employee: "Théogène Ndayisaba",
    type: "Study Leave",
    from: "2026-05-10",
    to: "2026-05-12",
    days: 2,
    status: "Rejected",
    reason: "Exam preparation",
    createdByRole: "office",
    visibilityRoles: ["admin", "hr", "office"],
    createdAt: "2026-04-10T08:00:00.000Z",
    updatedAt: "2026-04-10T15:18:00.000Z",
  },
];

function sortByRecent(data: LeaveRequest[]): LeaveRequest[] {
  return [...data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function normalizeDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateDays(from: string, to: string): number {
  const startDate = normalizeDate(from);
  const endDate = normalizeDate(to);
  if (!startDate || !endDate) {
    return 1;
  }

  const oneDayMs = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / oneDayMs) + 1;
  return Math.max(1, diffDays);
}

function getStorageData(): LeaveRequest[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(LEAVE_REQUESTS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as LeaveRequest[];
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getLeaveRequests(): LeaveRequest[] {
  const storageData = getStorageData();
  if (!storageData) {
    return sortByRecent(seedLeaveRequests);
  }

  return sortByRecent(storageData);
}

export function saveLeaveRequests(requests: LeaveRequest[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(LEAVE_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

export function initializeLeaveRequests(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!getStorageData()) {
    saveLeaveRequests(seedLeaveRequests);
  }
}

export function getCurrentLeaveUserRole(): UserRole {
  const user = getDemoUserById(getStoredUserId());
  return user?.role ?? "office";
}

function nextReferenceNumber(requests: LeaveRequest[]): string {
  const max = requests.reduce((acc, request) => {
    const n = Number(request.reference.split("-").at(-1) ?? 0);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);

  return `LEV-2026-${String(max + 1).padStart(3, "0")}`;
}

function defaultVisibility(createdByRole: UserRole): UserRole[] {
  const set = new Set<UserRole>(["admin", "hr"]);
  if (createdByRole === "office") {
    set.add("office");
  }

  return Array.from(set);
}

export type LeaveRequestInput = {
  employee: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  createdByRole: UserRole;
};

export function createLeaveRequest(input: LeaveRequestInput): LeaveRequest {
  const requests = getLeaveRequests();
  const now = new Date().toISOString();

  const request: LeaveRequest = {
    id: `lr-${Math.random().toString(36).slice(2, 10)}`,
    reference: nextReferenceNumber(requests),
    employee: input.employee,
    type: input.type,
    from: input.from,
    to: input.to,
    days: calculateDays(input.from, input.to),
    reason: input.reason,
    status: "Pending",
    createdByRole: input.createdByRole,
    visibilityRoles: defaultVisibility(input.createdByRole),
    createdAt: now,
    updatedAt: now,
  };

  saveLeaveRequests([request, ...requests]);
  return request;
}

export function getLeaveRequestById(requestId: string): LeaveRequest | null {
  return getLeaveRequests().find((request) => request.id === requestId) ?? null;
}

export function updateLeaveRequest(requestId: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
  const requests = getLeaveRequests();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index === -1) {
    return null;
  }

  const prev = requests[index];
  const nextFrom = updates.from ?? prev.from;
  const nextTo = updates.to ?? prev.to;

  const updated: LeaveRequest = {
    ...prev,
    ...updates,
    days: calculateDays(nextFrom, nextTo),
    updatedAt: new Date().toISOString(),
  };

  const next = [...requests];
  next[index] = updated;
  saveLeaveRequests(next);
  return updated;
}

export function setLeaveRequestStatus(requestId: string, status: LeaveStatus): LeaveRequest | null {
  return updateLeaveRequest(requestId, { status });
}

export function deleteLeaveRequest(requestId: string): void {
  const requests = getLeaveRequests().filter((request) => request.id !== requestId);
  saveLeaveRequests(requests);
}

export function getRoleVisibleLeaveRequests(role: UserRole): LeaveRequest[] {
  return getLeaveRequests().filter((request) => request.visibilityRoles.includes(role));
}
