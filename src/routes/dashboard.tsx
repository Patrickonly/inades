import { createFileRoute } from "@tanstack/react-router";
import { Activity, Clock, FolderOpen, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import inadesLogo from "../assets/inades-favicon.svg";
import AppLayout from "../components/AppLayout";
import StatsCard from "../components/StatsCard";
import { dashboardStats } from "../lib/dummy-data";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — INADES-Formation Rwanda DMS" },
      { name: "description", content: "Analytics dashboard for INADES-Formation Rwanda: HR, Finance, Operations." },
    ],
  }),
});

const typeIcon: Record<string, string> = { hr: "👥", finance: "💰", operations: "🚗", training: "📚" };

function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-primary p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Dashboard Analytics</h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Data trends, activity, and department performance at a glance.
              </p>
            </div>
            <div className="rounded-lg bg-white/95 p-2">
              <img src={inadesLogo} alt="INADES logo" className="h-12 w-12 object-contain" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Staff" value={dashboardStats.totalEmployees} icon={Users} trend="+3 this quarter" trendUp />
          <StatsCard title="Active Projects" value={dashboardStats.activeProjects} icon={FolderOpen} subtitle="Across 4 provinces" />
          <StatsCard title="Pending Requests" value={dashboardStats.pendingRequests} icon={Clock} trend="5 urgent" />
          <StatsCard title="Budget Utilization" value={`${dashboardStats.budgetUtilization}%`} icon={TrendingUp} trend="+8% vs last month" trendUp />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Monthly Expenses (RWF)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboardStats.monthlyExpenses}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} RWF`} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {dashboardStats.monthlyExpenses.map((_, i) => (
                    <Cell key={i} fill={i === dashboardStats.monthlyExpenses.length - 1 ? "var(--primary)" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="h-4 w-4 text-primary" /> Recent Activity
            </h2>
            <div className="space-y-3">
              {dashboardStats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <span className="mt-0.5 text-base">{typeIcon[activity.type] || "📋"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">{activity.action}</p>
                    <p className="text-[11px] text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Department Budget Overview</h2>
          <div className="space-y-3">
            {dashboardStats.departmentBudget.map((department) => {
              const percent = Math.round((department.spent / department.budget) * 100);
              return (
                <div key={department.name} className="flex items-center gap-4">
                  <span className="w-24 text-xs font-medium text-foreground">{department.name}</span>
                  <div className="flex-1">
                    <progress
                      value={percent}
                      max={100}
                      className="h-2.5 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold text-foreground">{percent}%</span>
                  <span className="w-28 text-right text-[11px] text-muted-foreground">
                    {(department.spent / 1000000).toFixed(1)}M / {(department.budget / 1000000).toFixed(1)}M
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
