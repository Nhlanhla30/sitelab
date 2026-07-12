import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { formatZAR, formatDate } from "@/utils";

type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type QuoteWithClient = QuoteRow & { clients: { name: string } | null };

export const metadata: Metadata = { title: "Quotes" };

const STATUS_BADGE: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  sent:     "bg-blue-100 text-blue-700",
  viewed:   "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  expired:  "bg-slate-100 text-slate-500",
};

const STATUS_LABEL: Record<string, string> = {
  draft:    "Draft",
  sent:     "Sent",
  viewed:   "Viewed",
  accepted: "Accepted",
  declined: "Declined",
  expired:  "Expired",
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
    <>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {list.length === 0
              ? "No quotes yet"
              : `${list.length} ${list.length === 1 ? "quote" : "quotes"}`}
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus size={14} strokeWidth={2.5} aria-hidden />
          New quote
        </Link>
      </div>

      {list.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FileText size={24} className="text-slate-400" aria-hidden />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">
            No quotes yet
          </h3>
          <p className="mb-5 text-sm text-slate-500">
            Create your first professional quote and send it to a client.
          </p>
          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Plus size={14} strokeWidth={2.5} aria-hidden />
            New quote
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quote #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((quote) => {
                  const badgeCls =
                    STATUS_BADGE[quote.status] ?? STATUS_BADGE.draft;
                  const label = STATUS_LABEL[quote.status] ?? "Draft";
                  const clientName =
                    (quote.clients as { name: string } | null)?.name ?? "—";
                  return (
                    <tr
                      key={quote.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-mono text-sm font-semibold">
                        <Link
                          href={`/dashboard/quotes/${quote.id}`}
                          className="text-emerald-600 hover:underline"
                        >
                          {quote.quote_number ?? "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {quote.title}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {formatZAR(quote.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeCls}`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(quote.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
