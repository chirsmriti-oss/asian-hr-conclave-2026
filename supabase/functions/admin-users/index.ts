import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.0";

type Role = "super_admin" | "admin";
type Status = "active" | "inactive";

type Payload = {
  action: "create" | "update" | "delete";
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: Status;
};

const DEFAULT_ALLOWED_ORIGINS = [
  "https://asian-hr-conclave-2026.vercel.app",
  "http://127.0.0.1:5174",
  "http://localhost:5174",
];

function allowedOrigins() {
  return (Deno.env.get("ADMIN_ALLOWED_ORIGINS") ?? DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeadersFor(request: Request) {
  const origin = request.headers.get("Origin");
  const allowedOrigin =
    origin && allowedOrigins().includes(origin) ? origin : DEFAULT_ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    Vary: "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  const headers = {
    ...corsHeadersFor(request),
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };

  return new Response(JSON.stringify(body), { status, headers });
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function isValidName(value: string) {
  return value.length >= 2 && value.length <= 120;
}

async function hasAnotherActiveSuperAdmin(
  serviceClient: ReturnType<typeof createClient>,
  currentId: string,
) {
  const { data, error } = await serviceClient
    .from("admins")
    .select("id")
    .eq("role", "super_admin")
    .eq("status", "active")
    .neq("id", currentId)
    .limit(1);

  if (error) throw new Error("Could not verify Super Admin continuity.");
  return (data?.length ?? 0) > 0;
}

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
};

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeadersFor(request), ...securityHeaders } });
  }

  if (request.method !== "POST") {
    return json(request, { error: "Method not allowed." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 20_000) {
    return json(request, { error: "Request is too large." }, 413);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json(request, { error: "Supabase function is not configured." }, 500);
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return json(request, { error: "Unauthorized." }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const serviceClient = createClient(supabaseUrl, serviceKey);

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json(request, { error: "Unauthorized." }, 401);
  }

  const { data: actingAdmin } = await serviceClient
    .from("admins")
    .select("id,role,status")
    .eq("id", user.id)
    .maybeSingle();

  if (!actingAdmin || actingAdmin.role !== "super_admin" || actingAdmin.status !== "active") {
    return json(request, { error: "Super Admin access required." }, 403);
  }

  try {
    const payload = (await request.json()) as Payload;
    const role = (payload.role ?? "admin") as Role;
    const status = (payload.status ?? "active") as Status;

    if (!["super_admin", "admin"].includes(role)) throw new Error("Invalid role.");
    if (!["active", "inactive"].includes(status)) throw new Error("Invalid status.");

    if (payload.action === "create") {
      const name = assertString(payload.name, "Name");
      const email = assertString(payload.email, "Email").toLowerCase();
      const password = assertString(payload.password, "Temporary password");

      if (!isValidName(name)) throw new Error("Name must be between 2 and 120 characters.");
      if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
      if (password.length < 8) throw new Error("Temporary password must be at least 8 characters.");

      const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
      });

      if (createError || !created.user) {
        throw new Error(createError?.message ?? "Could not create auth user.");
      }

      const { error: insertError } = await serviceClient.from("admins").insert({
        id: created.user.id,
        name,
        email,
        role,
        status,
      });

      if (insertError) {
        await serviceClient.auth.admin.deleteUser(created.user.id);
        throw new Error(insertError.message);
      }

      return json(request, { ok: true });
    }

    const id = assertString(payload.id, "Admin id");

    if (id === actingAdmin.id && payload.action === "delete") {
      throw new Error("You cannot delete your own admin account.");
    }

    if (payload.action === "update") {
      const name = assertString(payload.name, "Name");
      const email = assertString(payload.email, "Email").toLowerCase();

      if (!isValidName(name)) throw new Error("Name must be between 2 and 120 characters.");
      if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
      if (id === actingAdmin.id && (role !== "super_admin" || status !== "active")) {
        throw new Error("You cannot remove your own Super Admin access.");
      }

      if (
        (role !== "super_admin" || status !== "active") &&
        !(await hasAnotherActiveSuperAdmin(serviceClient, id))
      ) {
        throw new Error("At least one active Super Admin is required.");
      }

      const { error: authError } = await serviceClient.auth.admin.updateUserById(id, {
        email,
        email_confirm: true,
        user_metadata: { name, role },
      });
      if (authError) throw new Error(authError.message);

      const { error: updateError } = await serviceClient
        .from("admins")
        .update({ name, email, role, status })
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);

      return json(request, { ok: true });
    }

    if (payload.action === "delete") {
      const { data: targetAdmin, error: targetError } = await serviceClient
        .from("admins")
        .select("role,status")
        .eq("id", id)
        .maybeSingle();
      if (targetError) throw new Error("Could not verify admin user.");
      if (
        targetAdmin?.role === "super_admin" &&
        targetAdmin.status === "active" &&
        !(await hasAnotherActiveSuperAdmin(serviceClient, id))
      ) {
        throw new Error("At least one active Super Admin is required.");
      }

      const { error } = await serviceClient.auth.admin.deleteUser(id);
      if (error) throw new Error(error.message);
      return json(request, { ok: true });
    }

    return json(request, { error: "Unknown action." }, 400);
  } catch (error) {
    return json(request, { error: errorMessage(error) }, 400);
  }
});
