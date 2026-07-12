"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { SA_PROVINCES } from "@/types";

type ClientOption = { id: string; name: string };
type Props = { userId: string; clients: ClientOption[] };

const EMPTY = {
  name: "",
  client_id: "",
  description: "",
  address: "",
  city: "",
  province: "",
  start_date: "",
  end_date: "",
  budget: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export default function NewProjectModal({ userId, clients }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  function field(key: keyof typeof EMPTY) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function close() {
    setOpen(false);
    setForm(EMPTY);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id) { setError("Please select a client."); return; }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const budgetCents = Math.round((parseFloat(form.budget) || 0) * 100);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from("projects") as any).insert({
      user_id: userId,
      client_id: form.client_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      address: form.address.trim() || "",
      city: form.city.trim() || "",
      province: form.province || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      budget: budgetCents,
      status: "planning",
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    close();
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden />
        New project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={close}
            />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  New project
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 px-6 py-5">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Project name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={field("name")}
                      placeholder="e.g. Smith residence — bathroom renovation"
                      className={inputClass}
                    />
                  </div>

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
                        value={form.client_id}
                        onChange={field("client_id")}
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
                      Description{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={field("description")}
                      rows={2}
                      placeholder="Brief description of the project scope"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        Site address{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={field("address")}
                        placeholder="123 Main Street"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        City{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={field("city")}
                        placeholder="Johannesburg"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        Province{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (optional)
                        </span>
                      </label>
                      <select
                        value={form.province}
                        onChange={field("province")}
                        className={inputClass}
                      >
                        <option value="">Select province</option>
                        {SA_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        Start date{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={field("start_date")}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        End date{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={field("end_date")}
                        className={inputClass}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-900">
                        Budget{" "}
                        <span className="text-xs font-normal text-slate-500">
                          (Rands, optional)
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          R
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.budget}
                          onChange={field("budget")}
                          placeholder="0.00"
                          className={`${inputClass} pl-7`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {loading ? "Creating…" : "Create project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
