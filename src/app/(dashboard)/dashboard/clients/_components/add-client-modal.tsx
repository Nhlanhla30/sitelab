"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { SA_PROVINCES } from "@/types";

type Props = { userId: string };

const EMPTY = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export default function AddClientModal({ userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  function field(key: keyof typeof EMPTY) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function close() {
    setOpen(false);
    setForm(EMPTY);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from("clients") as any).insert({
      user_id: userId,
      name: form.name.trim(),
      contact_person: form.contact_person.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      province: form.province || null,
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
        Add client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Add client
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-6 py-5">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Company / client name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={field("name")}
                      placeholder="Smith Contractors (Pty) Ltd"
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Contact person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.contact_person}
                      onChange={field("contact_person")}
                      placeholder="John Smith"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={field("email")}
                      placeholder="john@smithcontractors.co.za"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={field("phone")}
                      placeholder="011 123 4567"
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-900">
                      Address{" "}
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
                  {loading ? "Saving…" : "Add client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
