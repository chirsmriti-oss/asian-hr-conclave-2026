import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Download, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  toCsv,
  type RegistrationRecord,
} from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/registrations")({
  component: RegistrationsPage,
});

type SortColumn = "created_at" | "name" | "email" | "organization";

function RegistrationsPage() {
  return (
    <RequireAdmin>
      {(admin) => (
        <AdminShell admin={admin} active="registrations">
          <RegistrationsContent />
        </AdminShell>
      )}
    </RequireAdmin>
  );
}

function RegistrationsContent() {
  const [rows, setRows] = useState<RegistrationRecord[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortColumn>("created_at");
  const [ascending, setAscending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RegistrationRecord | null>(null);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(count / pageSize));

  useEffect(() => {
    async function load() {
      setLoading(true);
      let request = supabase
        .from("registrations")
        .select("id,name,designation,organization,country_code,whatsapp,email,gender,created_at", {
          count: "exact",
        })
        .order(sort, { ascending })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (query.trim()) {
        const term = `%${query.trim()}%`;
        request = request.or(
          `name.ilike.${term},designation.ilike.${term},organization.ilike.${term},email.ilike.${term},whatsapp.ilike.${term}`,
        );
      }

      const { data, count: total } = await request;
      setRows((data ?? []) as RegistrationRecord[]);
      setCount(total ?? 0);
      setLoading(false);
    }

    load();
  }, [ascending, page, query, sort]);

  const rangeLabel = useMemo(() => {
    if (!count) return "No registrations";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    return `${start}-${end} of ${count}`;
  }, [count, page]);

  function toggleSort(column: SortColumn) {
    if (sort === column) {
      setAscending((current) => !current);
      return;
    }
    setSort(column);
    setAscending(column !== "created_at");
  }

  async function exportCsv() {
    let request = supabase
      .from("registrations")
      .select("id,name,designation,organization,country_code,whatsapp,email,gender,created_at")
      .order(sort, { ascending })
      .limit(5000);

    if (query.trim()) {
      const term = `%${query.trim()}%`;
      request = request.or(
        `name.ilike.${term},designation.ilike.${term},organization.ilike.${term},email.ilike.${term},whatsapp.ilike.${term}`,
      );
    }

    const { data } = await request;
    const csv = toCsv((data ?? []) as RegistrationRecord[]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Read-only records
          </p>
          <h1 className="mt-2 font-display text-4xl">Registrations</h1>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-midnight/10 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(event) => {
              setPage(1);
              setQuery(event.target.value);
            }}
            placeholder="Search registrations"
            className="max-w-sm"
          />
          <p className="text-sm text-midnight/58">{rangeLabel}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Name" onClick={() => toggleSort("name")} />
              <TableHead>Designation</TableHead>
              <SortHead label="Organization" onClick={() => toggleSort("organization")} />
              <TableHead>Country Code</TableHead>
              <TableHead>WhatsApp</TableHead>
              <SortHead label="Email" onClick={() => toggleSort("email")} />
              <TableHead>Gender</TableHead>
              <SortHead label="Submitted On" onClick={() => toggleSort("created_at")} />
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-midnight/55">
                  Loading registrations...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-midnight/55">
                  No registrations found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                  <TableCell>{row.organization}</TableCell>
                  <TableCell>{row.country_code}</TableCell>
                  <TableCell>{row.whatsapp}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(row)}>
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <p className="text-sm text-midnight/58">
            Page {page} of {pages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration details</DialogTitle>
          </DialogHeader>
          {selected && (
            <dl className="grid gap-3 text-sm">
              {Object.entries({
                Name: selected.name,
                Designation: selected.designation,
                Organization: selected.organization,
                "Country Code": selected.country_code,
                WhatsApp: selected.whatsapp,
                Email: selected.email,
                Gender: selected.gender,
                "Submitted On": formatDate(selected.created_at),
              }).map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                  <dt className="font-medium text-midnight/58">{label}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function SortHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <TableHead>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}
