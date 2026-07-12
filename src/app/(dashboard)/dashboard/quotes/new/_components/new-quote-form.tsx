"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatZAR, calculateVAT } from "@/utils";

type ClientOption = { id: string; name: string };

type LineItem = {
  id: string;
  description: string;
  category: "labour" | "material" | "equipment" | "other";
  quantity: string;
  unit: string;
  unit_price: string;
};

const CATEGORIES: { value: LineItem["category"]; label: string }[] = [
  { value: "labour",    label: "Labour"    },
  { value: "material",  label: "Material"  },
  { value: "equipment", label: "Equipment" },
  { value: "other",     label: "Other"     },
];

const UNITS = ["each", "m²", "m³", "m", "kg", "ton", "hours", "days", "bags", "L"];

function toCents(val: string): number {
  return Math.round((parseFloat(val) || 0) * 100);
}

function lineTotal(li: LineItem): number {
  return Math.round((parseFloat(li.quantity) || 0) * toCents(li.unit_price));
}

function blankItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    category: "material",
    quantity: "1",
    unit: "each",
    unit_price: "",
  };
}

function thirtyDaysOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const cellInputClass =
  "w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20";

export default function NewQuoteForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();

  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<LineItem[]>([blankItem()]);
  const [includeVat, setIncludeVat] = useState(true);
  const [validUntil, setValidUntil] = useState(thirtyDaysOut);
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, li) => sum + lineTotal(li), 0);
  const vatAmount = includeVat ? calculateVAT(subtotal) : 0;
  const total = subtotal + vatAmount;

  function updateItem(id: string, field: keyof LineItem, value: string) {
    setItems((prev) =>
      prev.map((li) => (li.id === id ? { ...li, [field]: value } : li))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, blankItem()]);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((li) => li.id !== id);
      return next.length > 0 ? next : [blankItem()];
    });
  }

  async function handleSave() {
    if (!clientId) { setError("Please select a client."); return; }
    if (!title.trim()) { setError("Please enter a quote title."); return; }
    if (!validUntil) { setError("Please set a valid until date."); return; }

    const filledItems = items.filter((li) => li.description.trim());
    if (filledItems.length === 0) {
      setError("Add at least one line item with a description.");
      return;
    }

    setError(null);
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired. Please sign in again.");
      setSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quoteResult = await (supabase.from("quotes") as any)
      .insert({
        user_id: user.id,
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || null,
        subtotal,
        vat_amount: vatAmount,
        total,
        include_vat: includeVat,
        valid_until: validUntil,
        terms: terms.trim() || null,
        notes: notes.trim() || null,
        status: "draft",
      })
      .select("id")
      .single();

    const quoteErr = quoteResult.error as { message: string } | null;
    const quote = quoteResult.data as { id: string } | null;

    if (quoteErr || !quote) {
      setError(quoteErr?.message ?? "Failed to save quote.");
      setSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: itemsErr } = await (supabase.from("quote_line_items") as any).insert(
      filledItems.map((li, i) => ({
        quote_id: quote.id,
        description: li.description.trim(),
        category: li.category,
        quantity: parseFloat(li.quantity) || 1,
        unit: li.unit,
        unit_price: toCents(li.unit_price),
        total: lineTotal(li),
        sort_order: i,
      }))
    );

    if (itemsErr) {
      setError(itemsErr.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/quotes");
  }

  return (
    <>
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft size={15} aria-hidden />
        Quotes
      </button>

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Quote</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Fill in the details below and save as a draft.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_272px]">
        {/* Left: form */}
        <div className="min-w-0 space-y-6">
          {/* Quote details card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quote details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Client <span className="text-red-500">*</span>
                </label>
                {clients.length === 0 ? (
                  <p className="text-sm text-amber-600">
                    No clients yet.{" "}
                    <a href="/dashboard/clients" className="underline">
                      Add a client first.
                    </a>
                  </p>
                ) : (
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Valid until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Quote title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bathroom renovation — Smith residence"
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Description{" "}
                  <span className="text-xs font-normal text-slate-500">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the scope of work"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Line items card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Line items
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ minWidth: 200 }}
                    >
                      Description
                    </th>
                    <th
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: 110 }}
                    >
                      Category
                    </th>
                    <th
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: 70 }}
                    >
                      Qty
                    </th>
                    <th
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: 80 }}
                    >
                      Unit
                    </th>
                    <th
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: 110 }}
                    >
                      Unit price (R)
                    </th>
                    <th
                      className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                      style={{ width: 100 }}
                    >
                      Total
                    </th>
                    <th style={{ width: 36 }} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((li) => {
                    const rowTotal = lineTotal(li);
                    return (
                      <tr key={li.id} className="group hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={li.description}
                            onChange={(e) =>
                              updateItem(li.id, "description", e.target.value)
                            }
                            placeholder="Describe the item or work"
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={li.category}
                            onChange={(e) =>
                              updateItem(li.id, "category", e.target.value)
                            }
                            className={cellInputClass}
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={li.quantity}
                            onChange={(e) =>
                              updateItem(li.id, "quantity", e.target.value)
                            }
                            min="0"
                            step="0.01"
                            className={`${cellInputClass} text-right`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            list={`units-${li.id}`}
                            value={li.unit}
                            onChange={(e) =>
                              updateItem(li.id, "unit", e.target.value)
                            }
                            className={cellInputClass}
                          />
                          <datalist id={`units-${li.id}`}>
                            {UNITS.map((u) => (
                              <option key={u} value={u} />
                            ))}
                          </datalist>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={li.unit_price}
                            onChange={(e) =>
                              updateItem(li.id, "unit_price", e.target.value)
                            }
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className={`${cellInputClass} text-right`}
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-semibold text-slate-900">
                          {rowTotal > 0 ? (
                            formatZAR(rowTotal)
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-1 py-2">
                          <button
                            type="button"
                            onClick={() => removeItem(li.id)}
                            className="flex h-7 w-7 items-center justify-center rounded text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove row"
                          >
                            <X size={13} aria-hidden />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-50"
              >
                <Plus size={13} strokeWidth={2.5} aria-hidden />
                Add line item
              </button>
            </div>
          </div>

          {/* Terms & notes card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Terms &amp; notes
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Terms &amp; conditions{" "}
                  <span className="text-xs font-normal text-slate-500">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={4}
                  placeholder="Payment terms, delivery conditions, warranty…"
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Internal notes{" "}
                  <span className="text-xs font-normal text-slate-500">
                    (not shown to client)
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Private notes about this quote…"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: sticky summary */}
        <div>
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatZAR(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded accent-emerald-600"
                  />
                  VAT (15%)
                </label>
                <span className="text-sm font-medium text-slate-900">
                  {includeVat ? (
                    formatZAR(vatAmount)
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    {formatZAR(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
