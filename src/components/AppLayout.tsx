import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
    AlertTriangle,
    BarChart3,
    Bell,
    Briefcase,
    Building2,
    CalendarDays,
    Car,
    ChevronDown,
    ClipboardCheck,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Fuel,
    GraduationCap,
    House,
    Landmark,
    LayoutDashboard,
    LogOut,
    Moon,
    Package,
    PanelLeft,
    Plane,
    Search,
    Settings,
    ShoppingCart,
    Sun,
    User,
    Users,
    Wallet
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import inadesLogo from "../assets/inades-favicon.svg";
import {
    applyTheme,
    canAccessPath,
    clearStoredUserId,
    getDemoUserById,
    getStoredTheme,
    getStoredUserId,
    roleDisplayName,
    setStoredUserId,
    type UserRole
} from "../lib/auth";
import { setPostLoginRedirectPath } from "../lib/otp-session";
import AppFooter from "./AppFooter";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const SIDEBAR_OPEN_STORAGE_KEY = "inades.sidebar-open";

type NavItem = {
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  to?: string;
  children?: { label: string; to: string; icon: React.ElementType; roles: UserRole[] }[];
};

const navItems: NavItem[] = [
  { label: "Home", icon: House, to: "/", roles: ["admin", "hr", "finance", "office"] },
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", roles: ["admin", "hr", "finance", "office"] },
  {
    label: "Human Resources", icon: Users, roles: ["admin", "hr", "office"],
    children: [
      { label: "Recruitment", to: "/hr/recruitment", icon: Briefcase, roles: ["admin", "hr"] },
      { label: "Training", to: "/hr/training", icon: GraduationCap, roles: ["admin", "hr", "office"] },
      { label: "Performance", to: "/hr/performance", icon: BarChart3, roles: ["admin", "hr"] },
      { label: "Leave Management", to: "/hr/leave", icon: CalendarDays, roles: ["admin", "hr", "office"] },
      { label: "Compensation", to: "/hr/compensation", icon: DollarSign, roles: ["admin", "hr"] },
      { label: "Disciplinary", to: "/hr/disciplinary", icon: AlertTriangle, roles: ["admin", "hr"] },
    ],
  },
  {
    label: "Financial Management", icon: CreditCard, roles: ["admin", "finance", "office"],
    children: [
      { label: "Payments", to: "/finance/payments", icon: CreditCard, roles: ["admin", "finance"] },
      { label: "Travel Requests", to: "/finance/travel", icon: Plane, roles: ["admin", "finance", "office"] },
      { label: "Vehicle Management", to: "/finance/vehicles", icon: Car, roles: ["admin", "finance"] },
      { label: "Fuel Management", to: "/finance/fuel", icon: Fuel, roles: ["admin", "finance"] },
      { label: "Mission Reports", to: "/finance/missions", icon: FileText, roles: ["admin", "finance"] },
      { label: "Procurement", to: "/finance/procurement", icon: ShoppingCart, roles: ["admin", "finance"] },
      { label: "Auctions", to: "/finance/auctions", icon: Landmark, roles: ["admin", "finance"] },
      { label: "Petty Cash", to: "/finance/petty-cash", icon: Wallet, roles: ["admin", "finance"] },
      { label: "Timesheets", to: "/finance/timesheets", icon: Clock, roles: ["admin", "finance", "office"] },
      { label: "Audit & Recommendations", to: "/finance/audit", icon: ClipboardCheck, roles: ["admin", "finance"] },
      { label: "Stock Management", to: "/finance/stock", icon: Package, roles: ["admin", "finance"] },
      { label: "Assets", to: "/finance/assets", icon: Building2, roles: ["admin", "finance"] },
      { label: "Fraud & Harassment Alerts", to: "/finance/fraud", icon: AlertTriangle, roles: ["admin", "finance"] },
    ],
  },
  {
    label: "Administration", icon: Settings, roles: ["admin"],
    children: [
      { label: "Users Management", to: "/user", icon: Users, roles: ["admin"] },
    ],
  },
  {
    label: "Reports & Analytics", icon: FileText, roles: ["admin", "hr", "finance", "office"],
    children: [
      { label: "Reports Overview", to: "/reports", icon: FileText, roles: ["admin", "hr", "finance", "office"] },
      { label: "Mission Reports", to: "/finance/missions", icon: FileText, roles: ["admin", "finance"] },
      { label: "Audit Reports", to: "/finance/audit", icon: ClipboardCheck, roles: ["admin", "finance"] },
    ],
  },
];

function getCurrentPathLabel(pathname: string, role: UserRole): string {
  const normalizedPath = (pathname || "/").toLowerCase();

  for (const item of navItems) {
    if (!item.roles.includes(role)) {
      continue;
    }

    if (item.to) {
      const exactMatch = normalizedPath === item.to;
      const childMatch = item.to !== "/" && normalizedPath.startsWith(`${item.to}/`);
      if (exactMatch || childMatch) {
        return item.label;
      }
      continue;
    }

    for (const child of item.children ?? []) {
      if (!child.roles.includes(role)) {
        continue;
      }

      const exactMatch = normalizedPath === child.to;
      const childMatch = child.to !== "/" && normalizedPath.startsWith(`${child.to}/`);
      if (exactMatch || childMatch) {
        return `${item.label} • ${child.label}`;
      }
    }
  }

  return normalizedPath;
}

function SidebarItem({ item, role }: { item: NavItem; role: UserRole }) {
  const location = useLocation();

  if (!item.roles.includes(role)) {
    return null;
  }

  const visibleChildren = item.children?.filter((child) => child.roles.includes(role));

  if (item.to) {
    const isActive = location.pathname === item.to;

    return (
      <Link
        to={item.to}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  if (!visibleChildren?.length) {
    return null;
  }

  return (
    <div className="mt-2 first:mt-0">
      <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
        {item.label}
      </div>
      <div className="space-y-0.5">
        {visibleChildren.map((child) => (
          <Link
            key={child.to}
            to={child.to}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors ${
              location.pathname === child.to
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <child.icon className="h-4 w-4 shrink-0" />
            <span>{child.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const storedState = localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
    return storedState === null ? true : storedState === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => getStoredUserId());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return getStoredTheme() === "dark";
  });

  const currentUser = useMemo(() => getDemoUserById(currentUserId), [currentUserId]);

  const visibleNavItems = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const keyword = menuSearch.trim().toLowerCase();

    return navItems
      .map((item) => {
        if (!item.roles.includes(currentUser.role)) {
          return null;
        }

        if (!item.children) {
          if (!keyword || item.label.toLowerCase().includes(keyword)) {
            return item;
          }

          return null;
        }

        const filteredChildren = item.children.filter((child) => child.roles.includes(currentUser.role));
        if (!filteredChildren.length) {
          return null;
        }

        if (!keyword) {
          return {
            ...item,
            children: filteredChildren,
          };
        }

        if (item.label.toLowerCase().includes(keyword)) {
          return {
            ...item,
            children: filteredChildren,
          };
        }

        const searchedChildren = filteredChildren.filter((child) => child.label.toLowerCase().includes(keyword));

        if (!searchedChildren.length) {
          return null;
        }

        return {
          ...item,
          children: searchedChildren,
        };
      })
      .filter(Boolean) as NavItem[];
  }, [currentUser, menuSearch]);

  const fallbackLinks = useMemo(() => {
    return visibleNavItems.flatMap((item) => {
      if (item.to) {
        return [{ label: item.label, to: item.to }];
      }

      return item.children?.map((child) => ({ label: child.label, to: child.to })) ?? [];
    });
  }, [visibleNavItems]);

  const canAccessCurrentPath = currentUser ? canAccessPath(currentUser.role, location.pathname) : false;
  const currentAccessLabel = useMemo(
    () => (currentUser ? getCurrentPathLabel(location.pathname, currentUser.role) : "Unknown"),
    [currentUser, location.pathname],
  );

  useEffect(() => {
    if (currentUser) {
      setStoredUserId(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      const redirectPath = location.pathname || "/";
      setPostLoginRedirectPath(redirectPath);
      navigate({
        to: "/login",
        replace: true,
      });
    }
  }, [currentUser, location.pathname, navigate]);

  useEffect(() => {
    applyTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
      return;
    }

    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    clearStoredUserId();
    setCurrentUserId(null);
    setMobileOpen(false);
    navigate({ to: "/logged-out", replace: true });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-sidebar">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden bg-sidebar transition-all duration-300 lg:relative ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarOpen ? "lg:w-64" : "lg:w-0"}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <img
            src={inadesLogo}
            alt="INADES logo"
            className="h-10 w-10 shrink-0 rounded-md bg-white object-contain p-0.5"
          />
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">INADES-Formation</p>
              <p className="truncate text-[11px] text-sidebar-foreground/50">Rwanda • DMS</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <div className="mb-3">
            <label htmlFor="sidebar-menu-search" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Search menu
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/45" />
              <input
                id="sidebar-menu-search"
                type="text"
                value={menuSearch}
                onChange={(event) => setMenuSearch(event.target.value)}
                placeholder="Search menu links..."
                className="h-9 w-full rounded-lg border border-sidebar-border bg-sidebar px-8 pr-3 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/45 outline-none focus:ring-2 focus:ring-sidebar-ring"
              />
            </div>
          </div>

          {visibleNavItems.map((item) => (
            <SidebarItem key={item.label} item={item} role={currentUser.role} />
          ))}

          {visibleNavItems.length === 0 && (
            <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-[12px] text-sidebar-foreground/70">
              No menu links match your search.
            </div>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="inades-page-enter sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/80 bg-[#FFFFFF] px-4 lg:px-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:bg-card">
          <button
            onClick={handleSidebarToggle}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
            aria-label="Toggle sidebar"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8BE000]"
            />
          </div>

          <div className="hidden items-center rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground lg:flex">
            Current: {currentAccessLabel}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="rounded-lg p-2 text-foreground hover:bg-muted"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              className="relative rounded-lg p-2 text-foreground hover:bg-muted"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8BE000]" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 hover:bg-muted"
                  aria-label="Open user menu"
                  title="User menu"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background">
                    <User className="h-4 w-4 text-[#8BE000]" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {roleDisplayName[currentUser.role]} • {currentUser.location}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="text-xs font-semibold">{currentUser.name}</p>
                  <p className="text-[11px] font-normal text-muted-foreground">
                    {currentUser.email} · {roleDisplayName[currentUser.role]}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.role === "admin" && (
                  <DropdownMenuItem onSelect={() => navigate({ to: "/user" })}>
                    <Users className="h-4 w-4" />
                    Users Management
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => navigate({ to: "/profile-settings" })}>
                  <Settings className="h-4 w-4" />
                  Profile settings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="inades-page-enter flex-1 overflow-y-auto bg-background/70 p-4 lg:p-6 dark:bg-sidebar">
          {canAccessCurrentPath ? (
            children
          ) : (
            <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Access limited for your role</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {roleDisplayName[currentUser.role]} users do not have access to <code>{location.pathname}</code>.
                Please use one of the links below.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {fallbackLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
        <AppFooter compact className="shrink-0" />
      </div>
    </div>
  );
}
