import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { redirect?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      setMessage("Invalid email or password.");
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("id,status")
      .eq("id", data.user.id)
      .maybeSingle();

    setLoading(false);

    if (!admin || admin.status !== "active") {
      await supabase.auth.signOut();
      setMessage("This account is not an active administrator.");
      return;
    }

    navigate({ to: search.redirect || "/admin/dashboard" });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ec] px-5 py-12 text-midnight">
      <section className="w-full max-w-md rounded-xl border border-midnight/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Admin access</p>
        <h1 className="mt-3 font-display text-4xl">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-midnight/62">
          Access is limited to active administrators.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message && <p className="text-sm font-medium text-red-700">{message}</p>}

          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
