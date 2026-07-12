import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil, Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { formatZAR, formatDate } from "@/utils";
import QuoteActions from "./_components/quote-actions";

type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type LineItemRow = Database["public"]["Tables"]["quote_line_items"]["Row"];
type QuoteStatus = QuoteRow["status"];

export const metadata: Metadata = { title: "Quote" };

const STATUS_CONFIG: Record<QuoteStatus, { label: string; cls: string }> = {
  draft:    { label: "Draft",    cls: "bg-slate-100 text-slate-600"      },
  sent:     { label: "Sent",     cls: "bg-blue-100 text-blue-700"        },
  viewed:   { label: "Viewed",   cls: "bg-amber-100 text-amber-700"      },
  accepted: { label: "Accepted", cls: "bg-emerald-100 text-emerald-700"  },
  declined: { label: "Declined", cls: "bg-red-100 text-red-700"          },
  expired:  { label: "Expired",  cls: "bg-slate-100 text-slate-500"      },
};

const CATEGORY_LABELS: Record<LineItemRow["category"], string> = {
  labour:    "Labour",
  material:  "Material",
  equipment: "Equipment",
  other:     "Other",
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const [quoteResult, lineItemsResult] = await Promise.all([
    db
      .from("quotes")
      .select("*, clients(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as Promise<{
      data: (QuoteRow & { clients: ClientRow | null }) | null;
      error: unknown;
    }>,
    db
      .from("quote_line_items")
      .select("*")
      .eq("quote_id", id)
      .order("sort_order", { ascending: true }) as Promise<{
      data: LineItemRow[] | null;
      error: unknown;
    }>,
  ]);

  if (quoteResult.error || !quoteResult.data) notFound();

  const quote = quoteResult.data;
  const lineItems = lineItemsResult.data ?? [];
  const client = quote.clients;
  const status = STATUS_CONFIG[quote.status];

  return (
    <>
      {/* Back link */}
      <Link
        href="/dashboard/quotes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft size={15} aria-hidden />
        Quotes
      </Link>

      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-slate-500">
              {quote.quote_number ?? "—"}
            </span>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.cls}`}
            >
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{quote.title}</h1>
          {quote.description && (
            <p className="mt-1 text-sm text-slate-500">{quote.description}</p>
          )}
        </div>
        <Link
          href={`/dashboard/quotes/${id}/edit`}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Pencil size={14} aria-hidden />
          Edit
        </Link>
      </div>

      {/* Status action bar */}
      <div className="mb-6">
        <QuoteActions quoteId={quote.id} status={quote.status} />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_272px]">
        {/* Left: line items + terms */}
        <div className="min-w-0 space-y-6">
          {/* Line items card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Line items
              </h2>
            </div>

            {lineItems.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500">
                No line items on this quote.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Unit price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {CATEGORY_LABELS[item.category]}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-900">
                          {item.quantity % 1 === 0
                            ? item.quantity
                            : item.quantity.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {item.unit}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-900">
                          {formatZAR(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {formatZAR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatZAR(quote.subtotal)}
                  </span>
                </div>
                {quote.include_vat && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">VAT (15%)</span>
                    <span className="font-medium text-slate-900">
                      {formatZAR(quote.vat_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2.5">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatZAR(quote.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          {quote.terms && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Terms &amp; conditions
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">
                {quote.terms}
              </p>
            </div>
          )}

          {/* Internal notes */}
          {quote.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Internal notes
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">
                {quote.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Client card */}
          {client && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </h2>
              <p className="font-semibold text-slate-900">{client.name}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                {client.contact_person}
              </p>
              <div className="mt-3 space-y-2">
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:underline"
                >
                  <Mail size={13} aria-hidden />
                  {client.email}
                </a>
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={13} aria-hidden />
                  {client.phone}
                </p>
                {(client.city || client.province) && (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={13} aria-hidden />
                    {[client.city, client.province].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dates card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dates
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-900">
                  {formatDate(quote.created_at)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Valid until</span>
                <span className="font-medium text-slate-900">
                  {formatDate(quote.valid_until)}
                </span>
              </div>
              {quote.sent_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Sent</span>
                  <span className="text-slate-900">
                    {formatDate(quote.sent_at)}
                  </span>
                </div>
              )}
              {quote.responded_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Responded</span>
                  <span className="text-slate-900">
                    {formatDate(quote.responded_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
