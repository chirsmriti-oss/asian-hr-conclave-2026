import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminShell,
  formatDate,
  RequireAdmin,
  type AdminProfile,
  type AdminRole,
  type AdminStatus,
} from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type FormState = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  status: AdminStatus;
};

const blankForm: FormState = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  status: "active",
};

function AdminUsersPage() {
  return (
    <RequireAdmin requireSuperAdmin>
      {(admin) => (
        <AdminShell admin={admin} active="users">
          <AdminUsersContent />
        </AdminShell>
      )}
    </RequireAdmin>
  );
}

function AdminUsersContent() {
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(blankForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAdmins() {
    setLoading(true);
    const { data } = await supabase
      .from("admins")
      .select("id,name,email,role,status,created_at")
      .order("created_at", { ascending: false });
    setAdmins((data ?? []) as AdminProfile[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return admins;
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(term) || admin.email.toLowerCase().includes(term),
    );
  }, [admins, query]);

  function openCreate() {
    setForm(blankForm);
    setMessage("");
    setDialogOpen(true);
  }

  function openEdit(admin: AdminProfile) {
    setForm({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      status: admin.status,
    });
    setMessage("");
    setDialogOpen(true);
  }

  async function callAdminFunction(body: Record<string, unknown>) {
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body,
    });

    if (error) throw new Error(error.message);
    if (data && typeof data === "object" && "error" in data) {
      throw new Error(String(data.error));
    }

    return data as { temporaryPassword?: string } | null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const result = await callAdminFunction({
        action: form.id ? "update" : "create",
        id: form.id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        status: form.status,
      });
      await loadAdmins();
      if (result?.temporaryPassword) {
        setMessage(`Created. Temporary password: ${result.temporaryPassword}`);
      } else {
        setDialogOpen(false);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save admin user.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAdmin(admin: AdminProfile) {
    if (!window.confirm(`Delete ${admin.email}? This cannot be undone.`)) return;
    setMessage("");
    try {
      await callAdminFunction({ action: "delete", id: admin.id });
      await loadAdmins();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete admin user.");
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Super Admin
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin Users</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create Admin
        </Button>
      </div>

      <div className="rounded-xl border border-midnight/10 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            className="max-w-sm"
          />
          <p className="text-sm text-midnight/58">{filtered.length} admin users</p>
        </div>
        {message && <p className="mb-4 text-sm font-medium text-red-700">{message}</p>}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-midnight/55">
                  Loading admin users...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-midnight/55">
                  No admin users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "active" ? "default" : "outline"}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(admin.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(admin)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit admin user" : "Create admin user"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="admin-name">
                Name
              </label>
              <Input
                id="admin-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="admin-email">
                Email
              </label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </div>
            {!form.id && (
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="admin-password">
                  Temporary password
                </label>
                <Input
                  id="admin-password"
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Role</label>
                <Select
                  value={form.role}
                  onValueChange={(value: AdminRole) =>
                    setForm((current) => ({ ...current, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(value: AdminStatus) =>
                    setForm((current) => ({ ...current, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {message && <p className="text-sm font-medium text-red-700">{message}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
