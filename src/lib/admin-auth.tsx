import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Shield } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminRole = "super_admin" | "admin";
export type AdminStatus = "active" | "inactive";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
};

export type RegistrationRecord = {
  id: string;
  name: string;
  designation: string;
  organization: string;
  country_code: string;
  whatsapp: string;
  email: string;
  gender: string;
  created_at: string;
};

type AdminState =
  | { status: "loading"; admin: null }
  | { status: "unauthenticated"; admin: null }
  | { status: "forbidden"; admin: null }
  | { status: "ready"; admin: AdminProfile };

export function useAdminSession() {
  const [state, setState] = useState<AdminState>({ status: "loading", admin: null });

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!active) return;
      if (!user) {
        setState({ status: "unauthenticated", admin: null });
        return;
      }

      const { data, error } = await supabase
        .from("admins")
        .select("id,name,email,role,status,created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      if (error || !data || data.status !== "active") {
        setState({ status: "forbidden", admin: null });
        return;
      }

      setState({ status: "ready", admin: data as AdminProfile });
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function RequireAdmin({
  children,
  requireSuperAdmin = false,
}: {
  children: (admin: AdminProfile) => ReactNode;
  requireSuperAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const state = useAdminSession();

  useEffect(() => {
    if (state.status === "unauthenticated") {
      navigate({ to: "/admin/login", search: { redirect: window.location.pathname } });
    }
  }, [navigate, state.status]);

  if (state.status === "loading" || state.status === "unauthenticated") {
    return <AdminLoading />;
  }

  if (state.status === "forbidden" || (requireSuperAdmin && state.admin.role !== "super_admin")) {
    return (
      <AdminMessage
        title="Access restricted"
        message="Your account does not have permission to access this admin area."
      />
    );
  }

  return <>{children(state.admin)}</>;
}

export function AdminShell({
  admin,
  children,
  active,
}: {
  admin: AdminProfile;
  children: ReactNode;
  active: "dashboard" | "users" | "registrations";
}) {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  const items = [
    { key: "dashboard", label: "Dashboard", to: "/admin/dashboard", allowed: true },
    {
      key: "users",
      label: "Admin Users",
      to: "/admin/users",
      allowed: admin.role === "super_admin",
    },
    { key: "registrations", label: "Registrations", to: "/admin/registrations", allowed: true },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-midnight">
      <header className="border-b border-midnight/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-midnight text-gold">
              <Shield className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-display text-xl leading-none">Admin Panel</span>
              <span className="block text-xs text-midnight/55">Asian HR Conclave</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium">{admin.name}</p>
              <p className="text-xs text-midnight/55">
                {admin.role === "super_admin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="rounded-lg border border-midnight/10 bg-white p-2 shadow-sm">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Admin">
            {items
              .filter((item) => item.allowed)
              .map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-midnight/68 transition-colors hover:bg-gold/10 hover:text-midnight",
                    active === item.key && "bg-midnight text-cream hover:bg-midnight hover:text-cream",
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f8f5ec] px-4 text-midnight">
      <div className="rounded-lg border border-midnight/10 bg-white px-6 py-5 text-sm shadow-sm">
        Loading admin session...
      </div>
    </div>
  );
}

export function AdminMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f8f5ec] px-4 text-midnight">
      <div className="max-w-md rounded-lg border border-midnight/10 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-midnight/65">{message}</p>
        <Link
          to="/admin/login"
          className="mt-6 inline-flex rounded-md bg-midnight px-4 py-2 text-sm font-medium text-cream"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toCsv(rows: RegistrationRecord[]) {
  const headers = [
    "Name",
    "Designation",
    "Organization",
    "Country Code",
    "WhatsApp",
    "Email",
    "Gender",
    "Submitted On",
  ];
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const body = rows.map((row) =>
    [
      row.name,
      row.designation,
      row.organization,
      row.country_code,
      row.whatsapp,
      row.email,
      row.gender,
      formatDate(row.created_at),
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...body].join("\n");
}
