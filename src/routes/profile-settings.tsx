import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import {
    getManagedUsers,
    getStoredUserId,
    initializeManagedUsers,
    roleDisplayName,
    saveManagedUsers,
    type UserRole,
} from "../lib/auth";

export const Route = createFileRoute("/profile-settings")({
  component: ProfileSettingsPage,
  head: () => ({
    meta: [
      { title: "Profile Settings — INADES DMS" },
      { name: "description", content: "Edit the profile details of the currently logged-in user" },
    ],
  }),
});

function ProfileSettingsPage() {
  const initialUserId = useMemo(() => getStoredUserId(), []);

  const [activeUserId, setActiveUserId] = useState<string | null>(initialUserId);
  const [role, setRole] = useState<UserRole>("office");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    location: "",
  });

  useEffect(() => {
    initializeManagedUsers();

    const userId = getStoredUserId();
    setActiveUserId(userId);

    if (!userId) {
      return;
    }

    const currentUser = getManagedUsers().find((user) => user.id === userId && !user.isLocked);
    if (!currentUser) {
      return;
    }

    setRole(currentUser.role);
    setForm({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department,
      location: currentUser.location,
    });
  }, []);

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeUserId) {
      toast.error("No active user session found.");
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const department = form.department.trim();
    const location = form.location.trim();

    if (!name || !email || !department || !location) {
      toast.error("Please fill all profile fields before saving.");
      return;
    }

    if (name.length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (department.length < 2) {
      toast.error("Department must be at least 2 characters.");
      return;
    }

    if (location.length < 2) {
      toast.error("Location must be at least 2 characters.");
      return;
    }

    const users = getManagedUsers();
    const targetUser = users.find((user) => user.id === activeUserId);

    if (!targetUser) {
      toast.error("Your account was not found in the users directory.");
      return;
    }

    const duplicate = users.find((user) => user.email.toLowerCase() === email && user.id !== activeUserId);
    if (duplicate) {
      toast.error("Another account already uses this email address.");
      return;
    }

    const nextUsers = users.map((user) => (
      user.id === activeUserId
        ? {
            ...user,
            name,
            email,
            department,
            location,
          }
        : user
    ));

    saveManagedUsers(nextUsers);
    setRole(targetUser.role);
    setForm({
      name,
      email,
      department,
      location,
    });
    toast.success("Profile updated successfully.");
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold text-foreground">Profile settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your own profile information used in the system.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {!activeUserId ? (
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              No active user session found. Please sign in again.
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Display name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="name@inades.org.rw"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                    placeholder="Department"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="Office location"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <p>
                  Role: <strong>{roleDisplayName[role]}</strong>
                </p>
                <p className="mt-1">
                  Session user ID: <code>{activeUserId}</code>
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                Save profile
              </button>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
