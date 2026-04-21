export type UserRole = "admin" | "hr" | "finance" | "office";
export type ThemeMode = "light" | "dark";

export const AUTH_USER_STORAGE_KEY = "inades.current-user-id";
export const THEME_STORAGE_KEY = "inades.theme";
export const USER_DIRECTORY_STORAGE_KEY = "inades.user-directory";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
};

export type ManagedUser = DemoUser & {
  isLocked: boolean;
};

export const roleDisplayName: Record<UserRole, string> = {
  admin: "Admin",
  hr: "HR",
  finance: "Finance",
  office: "Office",
};

export const demoUsers: DemoUser[] = [
  {
    id: "admin-patrick",
    name: "Patrick Only",
    email: "patrick.admin@inades.org.rw",
    role: "admin",
    department: "Administration",
    location: "National Office",
  },
  {
    id: "admin-claudine",
    name: "Claudine Mukamana",
    email: "claudine.admin@inades.org.rw",
    role: "admin",
    department: "Leadership",
    location: "National Office",
  },
  {
    id: "hr-grace",
    name: "Grace Uwase",
    email: "grace.hr@inades.org.rw",
    role: "hr",
    department: "Human Resources",
    location: "Kigali Office",
  },
  {
    id: "hr-emmanuel",
    name: "Emmanuel Ndayishimiye",
    email: "emmanuel.hr@inades.org.rw",
    role: "hr",
    department: "Human Resources",
    location: "Huye Office",
  },
  {
    id: "finance-marie",
    name: "Marie Claire Uwimana",
    email: "marie.finance@inades.org.rw",
    role: "finance",
    department: "Finance",
    location: "Kigali Office",
  },
  {
    id: "finance-jean",
    name: "Jean Bosco Murenzi",
    email: "jean.finance@inades.org.rw",
    role: "finance",
    department: "Finance",
    location: "National Office",
  },
  {
    id: "office-aline",
    name: "Aline Mukeshimana",
    email: "aline.office@inades.org.rw",
    role: "office",
    department: "Programs",
    location: "Nyamasheke Office",
  },
  {
    id: "office-eric",
    name: "Eric Hakizimana",
    email: "eric.office@inades.org.rw",
    role: "office",
    department: "Operations",
    location: "Ngoma Office",
  },
];

const allowedPathPrefixesByRole: Record<UserRole, string[]> = {
  admin: ["/", "/dashboard", "/hr", "/finance", "/table-editor", "/profile-settings", "/user", "/reports"],
  hr: ["/", "/dashboard", "/hr", "/table-editor", "/profile-settings", "/reports"],
  finance: ["/", "/dashboard", "/finance", "/table-editor", "/profile-settings", "/reports"],
  office: ["/", "/dashboard", "/hr/leave", "/hr/training", "/finance/travel", "/finance/timesheets", "/table-editor", "/profile-settings", "/reports"],
};

type LegacyRole = UserRole | "staff";

function normalizeRole(role: unknown): UserRole {
  const normalized = String(role ?? "").toLowerCase() as LegacyRole;
  if (normalized === "staff") {
    return "office";
  }

  if (normalized === "admin" || normalized === "hr" || normalized === "finance" || normalized === "office") {
    return normalized;
  }

  return "office";
}

function getDefaultManagedUsers(): ManagedUser[] {
  return demoUsers.map((user) => ({
    ...user,
    role: normalizeRole(user.role),
    isLocked: false,
  }));
}

function parseManagedUser(value: unknown): ManagedUser | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<ManagedUser>;
  if (!candidate.id || !candidate.name || !candidate.email || !candidate.department || !candidate.location) {
    return null;
  }

  return {
    id: String(candidate.id),
    name: String(candidate.name),
    email: String(candidate.email),
    role: normalizeRole(candidate.role),
    department: String(candidate.department),
    location: String(candidate.location),
    isLocked: Boolean(candidate.isLocked),
  };
}

export function initializeManagedUsers(): void {
  if (typeof window === "undefined") {
    return;
  }

  const existing = localStorage.getItem(USER_DIRECTORY_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(getDefaultManagedUsers()));
    return;
  }

  try {
    const parsed = JSON.parse(existing) as unknown;
    if (!Array.isArray(parsed)) {
      localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(getDefaultManagedUsers()));
      return;
    }

    const normalized = parsed.map(parseManagedUser).filter(Boolean) as ManagedUser[];
    if (!normalized.length) {
      localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(getDefaultManagedUsers()));
      return;
    }

    localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(getDefaultManagedUsers()));
  }
}

export function getManagedUsers(): ManagedUser[] {
  const fallback = getDefaultManagedUsers();

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = localStorage.getItem(USER_DIRECTORY_STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return fallback;
    }

    const users = parsed.map(parseManagedUser).filter(Boolean) as ManagedUser[];
    return users.length ? users : fallback;
  } catch {
    return fallback;
  }
}

export function saveManagedUsers(users: ManagedUser[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = users.map((user) => ({
    ...user,
    role: normalizeRole(user.role),
    isLocked: Boolean(user.isLocked),
  }));

  localStorage.setItem(USER_DIRECTORY_STORAGE_KEY, JSON.stringify(normalized));
}

export function getLoginEligibleUsers(): ManagedUser[] {
  return getManagedUsers().filter((user) => !user.isLocked);
}

export function getManagedUserById(userId?: string | null): ManagedUser | null {
  if (!userId) {
    return null;
  }

  return getManagedUsers().find((user) => user.id === userId) ?? null;
}

export function getDemoUserById(userId?: string | null): DemoUser | null {
  const user = getManagedUserById(userId);
  if (!user || user.isLocked) {
    return null;
  }

  return user;
}

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_USER_STORAGE_KEY);
}

export function setStoredUserId(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_USER_STORAGE_KEY, userId);
}

export function clearStoredUserId(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
}

export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  setStoredTheme(theme);
}

export function applyStoredTheme(): ThemeMode {
  const storedTheme = getStoredTheme();
  const theme: ThemeMode = storedTheme ?? "light";
  applyTheme(theme);
  return theme;
}

export function canAccessPath(role: UserRole, path: string): boolean {
  const normalizedPath = (path || "/").toLowerCase();
  const allowedPrefixes = allowedPathPrefixesByRole[role] ?? ["/"];

  return allowedPrefixes.some((prefix) => {
    if (prefix === "/") {
      return normalizedPath === "/";
    }

    return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
  });
}
