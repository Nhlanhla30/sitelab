"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatDate } from "@/utils";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  percent_complete: number;
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
};

type Props = {
  projectId: string;
  milestones: Milestone[];
};

const BLANK_FORM = { title: "", description: "", due_date: "" };

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

export default function MilestonesSection({ projectId, milestones }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  function field(key: keyof typeof BLANK_FORM) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setError(null);
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from("project_milestones") as any).insert({
      project_id: projectId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      due_date: form.due_date || null,
      percent_complete: 0,
      sort_order: milestones.length,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setForm(BLANK_FORM);
    setShowForm(false);
    router.refresh();
  }

  async function toggleComplete(m: Milestone) {
    setToggling(m.id);
    const nowComplete = m.completed_at === null;
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("project_milestones") as any)
      .update({
        percent_complete: nowComplete ? 100 : 0,
        completed_at: nowComplete ? new Date().toISOString() : null,
      })
      .eq("id", m.id);
    router.refresh();
    setToggling(null);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div>
          <h2 className="font-semibold text-[var(--foreground)]">Milestones</h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {milestones.length} {milestones.length === 1 ? "milestone" : "milestones"}
          </p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); setError(null); }}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--sl-slate-50)]"
        >
          <Plus size={13} strokeWidth={2.5} aria-hidden />
          Add milestone
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="border-b border-[var(--border)] bg-[var(--sl-slate-50)] px-6 py-4"
        >
          {error && (
            <p className="mb-3 text-sm text-red-600">{error}</p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_160px_auto]">
            <input
              type="text"
              required
              value={form.title}
              onChange={field("title")}
              placeholder="Milestone title"
              className={inputClass}
            />
            <input
              type="date"
              value={form.due_date}
              onChange={field("due_date")}
              className={inputClass}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Adding…" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(BLANK_FORM); setError(null); }}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
          <input
            type="text"
            value={form.description}
            onChange={field("description")}
            placeholder="Description (optional)"
            className={`${inputClass} mt-2`}
          />
        </form>
      )}

      {/* List */}
      {milestones.length === 0 && !showForm ? (
        <p className="px-6 py-8 text-sm text-[var(--muted-foreground)]">
          No milestones yet. Add one to start tracking progress.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {milestones.map((m) => {
            const done = m.completed_at !== null;
            return (
              <li key={m.id} className="flex items-start gap-4 px-6 py-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleComplete(m)}
                  disabled={toggling === m.id}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors disabled:opacity-50"
                  style={
                    done
                      ? {
                          backgroundColor: "var(--sl-green-500)",
                          borderColor: "var(--sl-green-500)",
                        }
                      : { borderColor: "var(--sl-slate-300)" }
                  }
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done && <Check size={11} color="white" strokeWidth={3} aria-hidden />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`text-sm font-medium ${
                        done
                          ? "text-[var(--muted-foreground)] line-through"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {m.title}
                    </p>
                    {m.due_date && (
                      <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                        Due {formatDate(m.due_date)}
                      </span>
                    )}
                  </div>

                  {m.description && (
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {m.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--sl-slate-200)]">
                      <div
                        className="h-full rounded-full bg-[var(--sl-green-500)] transition-all"
                        style={{ width: `${m.percent_complete}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {m.percent_complete}%
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
