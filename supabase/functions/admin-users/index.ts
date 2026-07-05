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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "Supabase function is not configured." }, 500);
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Unauthorized." }, 401);
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
    return json({ error: "Unauthorized." }, 401);
  }

  const { data: actingAdmin } = await serviceClient
    .from("admins")
    .select("id,role,status")
    .eq("id", user.id)
    .maybeSingle();

  if (!actingAdmin || actingAdmin.role !== "super_admin" || actingAdmin.status !== "active") {
    return json({ error: "Super Admin access required." }, 403);
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

      return json({ ok: true });
    }

    const id = assertString(payload.id, "Admin id");

    if (id === actingAdmin.id && payload.action === "delete") {
      throw new Error("You cannot delete your own admin account.");
    }

    if (payload.action === "update") {
      const name = assertString(payload.name, "Name");
      const email = assertString(payload.email, "Email").toLowerCase();

      if (id === actingAdmin.id && (role !== "super_admin" || status !== "active")) {
        throw new Error("You cannot remove your own Super Admin access.");
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

      return json({ ok: true });
    }

    if (payload.action === "delete") {
      const { error } = await serviceClient.auth.admin.deleteUser(id);
      if (error) throw new Error(error.message);
      return json({ ok: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Request failed." }, 400);
  }
});
