"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AddClientModal({ userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  function field(key: keyof typeof EMPTY) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
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

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Add client</h2>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--sl-slate-100)] hover:text-[var(--foreground)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Company / client name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required value={form.name} onChange={field("name")} placeholder="Smith Contractors (Pty) Ltd" className={inputClass} />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Contact person <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required value={form.contact_person} onChange={field("contact_person")} placeholder="John Smith" className={inputClass} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" required value={form.email} onChange={field("email")} placeholder="john@smithcontractors.co.za" className={inputClass} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" required value={form.phone} onChange={field("phone")} placeholder="011 123 4567" className={inputClass} />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Address <span className="text-xs font-normal text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input type="text" value={form.address} onChange={field("address")} placeholder="123 Main Street" className={inputClass} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    City <span className="text-xs font-normal text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input type="text" value={form.city} onChange={field("city")} placeholder="Johannesburg" className={inputClass} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Province <span className="text-xs font-normal text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <select value={form.province} onChange={field("province")} className={inputClass}>
                    <option value="">Select province</option>
                    {SA_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--sl-slate-50)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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
