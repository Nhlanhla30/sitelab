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
  "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden />
        Add client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Add client
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--sl-slate-100)] hover:text-[var(--foreground)]"
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      Address{" "}
                      <span className="text-xs font-normal text-[var(--muted-foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      City{" "}
                      <span className="text-xs font-normal text-[var(--muted-foreground)]">
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
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      Province{" "}
                      <span className="text-xs font-normal text-[var(--muted-foreground)]">
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
              <div className="flex gap-3 border-t border-[var(--border)] px-6 py-4">
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
