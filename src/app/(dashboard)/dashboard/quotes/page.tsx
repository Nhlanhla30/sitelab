import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { formatZAR, formatDate } from "@/utils";

type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type QuoteWithClient = QuoteRow & { clients: { name: string } | null };

export const metadata: Metadata = { title: "Quotes" };

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  draft:    { label: "Draft",    className: "badge-draft" },
  sent:     { label: "Sent",     className: "badge-sent" },
  viewed:   { label: "Viewed",   className: "badge-viewed" },
  accepted: { label: "Accepted", className: "badge-accepted" },
  declined: { label: "Declined", className: "badge-declined" },
  expired:  { label: "Expired",  className: "badge-draft" },
};

export default async function QuotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quotesRaw } = await supabase
    .from("quotes")
    .select("*, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (quotesRaw ?? []) as QuoteWithClient[];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Quotes</h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {list.length} {list.length === 1 ? "quote" : "quotes"}
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New quote
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-16 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No quotes yet.{" "}
            <Link href="/dashboard/quotes/new" className="text-[var(--primary)] hover:underline">
              Create your first quote
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sl-slate-50)]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Quote #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Title</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((quote) => {
                const status = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.draft;
                const clientName =
                  (quote.clients as { name: string } | null)?.name ?? "—";
                return (
                  <tr
                    key={quote.id}
                    className="transition-colors hover:bg-[var(--sl-slate-50)]"
                  >
                    <td className="px-4 py-3 font-mono text-sm font-medium text-[var(--foreground)]">
                      {quote.quote_number ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{clientName}</td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{quote.title}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">
                      {formatZAR(quote.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      {formatDate(quote.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
