import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, UserRoundCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, RequireAdmin, type AdminProfile } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <RequireAdmin>
      {(admin) => (
        <AdminShell admin={admin} active="dashboard">
          <DashboardContent admin={admin} />
        </AdminShell>
      )}
    </RequireAdmin>
  );
}

function DashboardContent({ admin }: { admin: AdminProfile }) {
  const [registrations, setRegistrations] = useState<number | null>(null);
  const [admins, setAdmins] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { count: registrationCount } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true });
      setRegistrations(registrationCount ?? 0);

      if (admin.role === "super_admin") {
        const { count: adminCount } = await supabase
          .from("admins")
          .select("id", { count: "exact", head: true });
        setAdmins(adminCount ?? 0);
      }
    }

    load();
  }, [admin.role]);

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Overview</p>
        <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Registrations"
          value={registrations}
          icon={<UserRoundCheck className="h-5 w-5" />}
        />
        {admin.role === "super_admin" && (
          <StatCard label="Total Admin Users" value={admins} icon={<Users className="h-5 w-5" />} />
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | null;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-midnight/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-midnight/62">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/12 text-midnight">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-4xl font-semibold">{value === null ? "..." : value}</p>
    </article>
  );
}
