"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { formatDate } from "@/utils";

type WeatherType = "sunny" | "cloudy" | "rainy" | "windy" | "stormy";

type DiaryEntry = {
  id: string;
  date: string;
  weather: WeatherType;
  workers_on_site: number;
  notes: string;
  created_at: string;
};

type Props = {
  projectId: string;
  createdBy: string;
  entries: DiaryEntry[];
};

const WEATHER_OPTIONS: { value: WeatherType; label: string; icon: string }[] = [
  { value: "sunny",  label: "Sunny",  icon: "☀️" },
  { value: "cloudy", label: "Cloudy", icon: "☁️" },
  { value: "rainy",  label: "Rainy",  icon: "🌧️" },
  { value: "windy",  label: "Windy",  icon: "💨" },
  { value: "stormy", label: "Stormy", icon: "⛈️" },
];

function weatherIcon(w: WeatherType): string {
  return WEATHER_OPTIONS.find((o) => o.value === w)?.icon ?? "—";
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

const BLANK = { date: todayStr(), weather: "sunny" as WeatherType, workers: "1", notes: "" };

export default function DiarySection({ projectId, createdBy, entries }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.notes.trim()) { setError("Please add some notes."); return; }
    setError(null);
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from("site_diary_entries") as any).insert({
      project_id: projectId,
      created_by: createdBy,
      date: form.date,
      weather: form.weather,
      workers_on_site: parseInt(form.workers) || 0,
      notes: form.notes.trim(),
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setForm({ ...BLANK, date: todayStr() });
    setShowForm(false);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <h2 className="font-semibold text-[var(--foreground)]">
          Site diary{" "}
          <span className="ml-1 text-sm font-normal text-[var(--muted-foreground)]">
            ({entries.length} {entries.length === 1 ? "entry" : "entries"})
          </span>
        </h2>
        <button
          onClick={() => { setShowForm((s) => !s); setError(null); }}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--sl-slate-50)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add entry
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="border-b border-[var(--border)] bg-[var(--sl-slate-50)] px-6 py-4 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Weather</label>
              <select
                value={form.weather}
                onChange={(e) => setForm((f) => ({ ...f, weather: e.target.value as WeatherType }))}
                className={inputClass}
              >
                {WEATHER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.icon} {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Workers on site</label>
              <input
                type="number"
                min="0"
                value={form.workers}
                onChange={(e) => setForm((f) => ({ ...f, workers: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Notes <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="What happened on site today?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Add entry"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm({ ...BLANK, date: todayStr() }); setError(null); }}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Entries list */}
      {entries.length === 0 && !showForm ? (
        <p className="px-6 py-8 text-sm text-[var(--muted-foreground)]">
          No diary entries yet. Start logging daily site activity.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {entries.map((entry) => (
            <li key={entry.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none" role="img" aria-label={entry.weather}>
                    {weatherIcon(entry.weather)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {formatDate(entry.date)}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {entry.workers_on_site} {entry.workers_on_site === 1 ? "worker" : "workers"} on site
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--foreground)] leading-relaxed line-clamp-3">
                {entry.notes}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
