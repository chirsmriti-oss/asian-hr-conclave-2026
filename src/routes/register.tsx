import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { publicSupabase } from "@/integrations/supabase/public-client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Confirm Your Participation · Asian HR Conclave & Top CHRO Awards Night 2026" },
      {
        name: "description",
        content:
          "Confirm your attendance for the Asian HR Conclave & Top CHRO Awards Night 2026, presented by Asia INC 500.",
      },
      { property: "og:title", content: "Confirm Your Participation · Asian HR Conclave 2026" },
      {
        property: "og:description",
        content: "Secure your invitation to India's most credible CHRO recognition programme.",
      },
    ],
  }),
  component: RegisterPage,
});

const genders = ["Female", "Male", "Nonbinary", "Prefer not to say"];

function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    name: "",
    title: "",
    origin: "",
    countryCode: "+91",
    whatsapp: "",
    email: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim() || values.name.trim().length > 100)
      e.name = "Please enter your name (max 100 chars).";
    if (!values.title.trim() || values.title.trim().length > 120)
      e.title = "Please enter your title / designation.";
    if (!values.origin.trim() || values.origin.trim().length > 120)
      e.origin = "Please tell us where you are coming from.";
    if (!/^\+\d{1,4}$/.test(values.countryCode)) e.countryCode = "Country code e.g. +91";
    if (!/^\d{6,15}$/.test(values.whatsapp.replace(/\s/g, "")))
      e.whatsapp = "Enter a valid WhatsApp number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      e.email = "Enter a valid email address.";
    if (!values.gender) e.gender = "Please select an option.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await publicSupabase.from("registrations").insert({
      name: values.name.trim(),
      designation: values.title.trim(),
      organization: values.origin.trim(),
      country_code: values.countryCode.trim(),
      whatsapp: values.whatsapp.replace(/\s/g, ""),
      email: values.email.trim(),
      gender: values.gender,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("Something went wrong. Please try again or contact us directly.");
      return;
    }
    setSubmitted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Slim header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-midnight/90 backdrop-blur-xl border-b border-gold/15">
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 group">
            <div className="shrink-0 h-9 w-9 rounded-full border border-gold/60 grid place-items-center text-gold font-display text-lg transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-gold/10">
              A
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-cream font-display text-base lg:text-lg tracking-wide">
                Asian HR Conclave
              </div>
              <div className="truncate text-gold/80 text-[10px] tracking-[0.25em] uppercase">
                Presented by Asia INC 500
              </div>
            </div>
          </Link>
          <Link
            to="/"
            className="text-cream/75 hover:text-gold text-sm tracking-wide transition-colors"
          >
            ← Back to Home
          </Link>
        </nav>
      </header>

      {/* Hero band */}
      <section className="relative pt-32 lg:pt-40 pb-14 bg-midnight text-cream overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.22),transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-10 bg-gold/60" />
            <span className="eyebrow">Delegate Confirmation · 2026</span>
            <span className="h-px w-10 bg-gold/60" />
          </div>
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cream">
            Secure your invitation to{" "}
            <span className="italic gold-text">India's most credible</span> CHRO recognition
            programme.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-cream/75 text-base sm:text-lg leading-relaxed">
            Complete the form below and our team will confirm your participation with full event
            details.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          {submitted ? (
            <div className="lux-card p-10 lg:p-14 text-center">
              <span className="eyebrow">Confirmation Received</span>
              <h2 className="mt-5 font-display text-3xl lg:text-4xl">
                Thank you, {values.name.split(" ")[0]}.
              </h2>
              <span className="gold-divider mx-auto mt-6" />
              <p className="mt-6 text-midnight/75 leading-relaxed">
                Your participation confirmation has been received. A member of the Asia INC 500 team
                will be in touch shortly with your confirmation and event details.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/" className="btn-gold btn-gold-hover gold-glow">
                  Back to Home
                </Link>
                <a
                  href="mailto:Bhamini@asiainc500.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-midnight/20 text-midnight text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  Contact the Director
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="lux-card p-8 lg:p-12">
              <div className="mb-8">
                <span className="eyebrow">Delegate Details</span>
                <h2 className="mt-3 font-display text-3xl lg:text-4xl">
                  Delegate Confirmation Form
                </h2>
                <span className="gold-divider mt-5" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field
                  label="Name (as per Aadhaar Card)"
                  id="name"
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="lux-input"
                    placeholder="As it appears on your Aadhaar Card"
                  />
                </Field>

                <Field label="Title / Designation" id="title" error={errors.title}>
                  <input
                    id="title"
                    type="text"
                    maxLength={120}
                    value={values.title}
                    onChange={(e) => set("title", e.target.value)}
                    className="lux-input"
                    placeholder="e.g. Chief Human Resources Officer"
                  />
                </Field>

                <Field label="Coming From" id="origin" error={errors.origin}>
                  <input
                    id="origin"
                    type="text"
                    maxLength={120}
                    value={values.origin}
                    onChange={(e) => set("origin", e.target.value)}
                    className="lux-input"
                    placeholder="e.g. Mumbai, India"
                  />
                </Field>

                <Field
                  label="WhatsApp Number"
                  id="whatsapp"
                  error={errors.countryCode || errors.whatsapp}
                  className="sm:col-span-2"
                >
                  <div className="grid grid-cols-[110px_1fr] gap-3">
                    <input
                      aria-label="Country code"
                      type="text"
                      value={values.countryCode}
                      onChange={(e) => set("countryCode", e.target.value)}
                      className="lux-input text-center"
                      placeholder="+91"
                      maxLength={5}
                    />
                    <input
                      id="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                      className="lux-input"
                      placeholder="98765 43210"
                      maxLength={20}
                    />
                  </div>
                </Field>

                <Field label="Email ID" id="email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={120}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="lux-input"
                    placeholder="e.g. you@company.com"
                  />
                </Field>

                <Field label="Gender" id="gender" error={errors.gender}>
                  <select
                    id="gender"
                    value={values.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    className="lux-input appearance-none pr-10 bg-[right_1rem_center] bg-no-repeat"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9A84C' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")",
                    }}
                  >
                    <option value="">Select…</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {submitError && (
                <p className="mt-6 text-sm text-red-700 text-center">{submitError}</p>
              )}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5">
                <p className="text-xs text-midnight/55 leading-relaxed max-w-sm">
                  By submitting, you agree to be contacted by the Asia INC 500 events team regarding
                  your participation.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold btn-gold-hover gold-glow w-full sm:w-auto justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Confirm Participation →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-midnight-deep text-cream/60 border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span>© 2026 Asia INC 500. All rights reserved.</span>
          <Link to="/" className="hover:text-gold transition-colors">
            Return to Home →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  id,
  error,
  className = "",
  children,
}: {
  label: string;
  id: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[10px] tracking-[0.25em] uppercase text-midnight/60 mb-2"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
