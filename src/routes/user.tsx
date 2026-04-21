import { createFileRoute } from "@tanstack/react-router";
import { Lock, LockOpen, PencilLine, RefreshCw, Save, Trash2, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
    getDemoUserById,
    getManagedUsers,
    getStoredUserId,
    initializeManagedUsers,
    roleDisplayName,
    saveManagedUsers,
    type ManagedUser,
    type UserRole,
} from "../lib/auth";

export const Route = createFileRoute("/user")({
  component: UserManagementPage,
  head: () => ({
    meta: [
      { title: "Users Management — INADES DMS" },
      { name: "description", content: "Manage system users: add, edit, lock, unlock, and delete" },
    ],
  }),
});

function UserManagementPage() {
  const currentUser = useMemo(() => getDemoUserById(getStoredUserId()), []);
  const canManageUsers = currentUser?.role === "admin";

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<ManagedUser | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    userId: string;
    userName: string;
    nextLocked: boolean;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "office" as UserRole,
    department: "",
    location: "",
  });

  useEffect(() => {
    initializeManagedUsers();
    setUsers(getManagedUsers());
  }, []);

  const roleOptions: UserRole[] = ["admin", "hr", "finance", "office"];

  const persistUsers = (nextUsers: ManagedUser[]) => {
    setUsers(nextUsers);
    saveManagedUsers(nextUsers);
  };

  const fetchUsers = (showToast = true) => {
    const fetchedUsers = getManagedUsers();
    setUsers(fetchedUsers);
    if (showToast) {
      toast.success("Users fetched successfully.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      role: "office",
      department: "",
      location: "",
    });
  };

  const handleSaveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManageUsers) {
      toast.error("Only Admin users can manage users.");
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const department = form.department.trim();
    const location = form.location.trim();

    if (!name || !email || !department || !location) {
      toast.error("Please fill all user fields before saving.");
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

    const duplicate = users.find((user) => user.email.toLowerCase() === email && user.id !== editingId);
    if (duplicate) {
      toast.error("A user with this email already exists.");
      return;
    }

    if (editingId) {
      const nextUsers = users.map((user) => (
        user.id === editingId
          ? {
              ...user,
              ...form,
              name,
              email,
              department,
              location,
            }
          : user
      ));
      persistUsers(nextUsers);
      toast.success("User updated successfully.");
      resetForm();
      return;
    }

    const nextUser: ManagedUser = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      email,
      role: form.role,
      department,
      location,
      isLocked: false,
    };

    persistUsers([nextUser, ...users]);
    toast.success("User added successfully.");
    resetForm();
  };

  const handleEditUser = (user: ManagedUser) => {
    if (!canManageUsers) {
      toast.error("Only Admin users can manage users.");
      return;
    }

    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      location: user.location,
    });
    toast.message(`Editing ${user.name}.`);
  };

  const requestStatusChange = (user: ManagedUser, nextLocked: boolean) => {
    if (!canManageUsers) {
      toast.error("Only Admin users can manage users.");
      return;
    }

    if (nextLocked === user.isLocked) {
      return;
    }

    setPendingStatusChange({
      userId: user.id,
      userName: user.name,
      nextLocked,
    });
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) {
      return;
    }

    const targetUser = users.find((user) => user.id === pendingStatusChange.userId);
    if (!targetUser) {
      setPendingStatusChange(null);
      toast.error("Selected user no longer exists.");
      return;
    }

    if (currentUser?.id === targetUser.id && pendingStatusChange.nextLocked) {
      toast.error("You cannot lock your own active account.");
      setPendingStatusChange(null);
      return;
    }

    if (targetUser.role === "admin" && pendingStatusChange.nextLocked) {
      const activeOtherAdmins = users.filter((user) => user.role === "admin" && !user.isLocked && user.id !== targetUser.id).length;
      if (activeOtherAdmins < 1) {
        toast.error("At least one active Admin account must remain.");
        setPendingStatusChange(null);
        return;
      }
    }

    const nextUsers = users.map((user) => (
      user.id === targetUser.id ? { ...user, isLocked: pendingStatusChange.nextLocked } : user
    ));
    persistUsers(nextUsers);
    toast.success(`${targetUser.name} is now ${pendingStatusChange.nextLocked ? "Locked" : "Active"}.`);
    setPendingStatusChange(null);
  };

  const requestDeleteUser = (user: ManagedUser) => {
    if (!canManageUsers) {
      toast.error("Only Admin users can manage users.");
      return;
    }

    setPendingDeleteUser(user);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteUser) {
      return;
    }

    if (currentUser?.id === pendingDeleteUser.id) {
      toast.error("You cannot delete your own active account.");
      setPendingDeleteUser(null);
      return;
    }

    const adminCount = users.filter((item) => item.role === "admin").length;
    if (pendingDeleteUser.role === "admin" && adminCount <= 1) {
      toast.error("At least one Admin account must remain.");
      setPendingDeleteUser(null);
      return;
    }

    const nextUsers = users.filter((item) => item.id !== pendingDeleteUser.id);
    persistUsers(nextUsers);
    if (editingId === pendingDeleteUser.id) {
      resetForm();
    }
    toast.success("User deleted successfully.");
    setPendingDeleteUser(null);
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold text-foreground">Users Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users with full CRUD: fetch, add, edit, update status, and delete.
          </p>
        </div>

        {!canManageUsers ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Access restricted</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only Admin users can add, edit, lock, unlock, or delete accounts.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">Users directory</h2>
                <p className="text-sm text-muted-foreground">
                  Roles supported: Admin, HR, Finance, Office.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchUsers(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Fetch users
                </button>
                <span className="rounded-full border border-[#F28C00]/40 bg-[#F28C00]/10 px-3 py-1 text-xs font-medium text-[#000000]">
                  {users.length} users
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="grid gap-4 rounded-lg border border-border bg-background p-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="name@inades.org.rw"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="user-role" className="mb-1 block text-xs text-muted-foreground">Role</label>
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {roleDisplayName[role]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                  placeholder="Department"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Office location"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {editingId ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {editingId ? "Save user" : "Add user"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3 py-2 font-medium text-foreground">{user.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
                      <td className="px-3 py-2">{roleDisplayName[user.role]}</td>
                      <td className="px-3 py-2">{user.department}</td>
                      <td className="px-3 py-2">{user.location}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.isLocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {user.isLocked ? "Locked" : "Active"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                            title="Edit user"
                          >
                            <PencilLine className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => requestStatusChange(user, !user.isLocked)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#F28C00]/35 px-2 py-1 text-xs hover:bg-[#F28C00]/10"
                            title={user.isLocked ? "Set Active" : "Set Locked"}
                          >
                            {user.isLocked ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                            {user.isLocked ? "Set Active" : "Set Locked"}
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteUser(user)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            title="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AlertDialog open={Boolean(pendingStatusChange)} onOpenChange={(open) => !open && setPendingStatusChange(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm status update</AlertDialogTitle>
                  <AlertDialogDescription>
                    {pendingStatusChange
                      ? `Set ${pendingStatusChange.userName} to ${pendingStatusChange.nextLocked ? "Locked" : "Active"}?`
                      : "Are you sure you want to update this status?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={Boolean(pendingDeleteUser)} onOpenChange={(open) => !open && setPendingDeleteUser(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete user</AlertDialogTitle>
                  <AlertDialogDescription>
                    {pendingDeleteUser
                      ? `Delete ${pendingDeleteUser.name}? This action cannot be undone.`
                      : "Are you sure you want to delete this user?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </AppLayout>
  );
}