import { createClient } from "@supabase/supabase-js";

const json = (response, status, body) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(JSON.stringify(body));
};

const assertString = (value, label) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
const isValidName = (value) => value.length >= 2 && value.length <= 120;

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function hasAnotherActiveSuperAdmin(serviceClient, currentId) {
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

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { error: "Method not allowed." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceKey) {
    return json(response, 500, { error: "Admin service is not configured." });
  }

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return json(response, 401, { error: "Unauthorized." });
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const serviceClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json(response, 401, { error: "Unauthorized." });
  }

  const { data: actingAdmin } = await serviceClient
    .from("admins")
    .select("id,role,status")
    .eq("id", user.id)
    .maybeSingle();

  if (!actingAdmin || actingAdmin.role !== "super_admin" || actingAdmin.status !== "active") {
    return json(response, 403, { error: "Super Admin access required." });
  }

  try {
    const payload = await readBody(request);
    const role = payload.role ?? "admin";
    const status = payload.status ?? "active";

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

      return json(response, 200, { ok: true });
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

      return json(response, 200, { ok: true });
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
      return json(response, 200, { ok: true });
    }

    return json(response, 400, { error: "Unknown action." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    return json(response, 400, { error: message });
  }
}
