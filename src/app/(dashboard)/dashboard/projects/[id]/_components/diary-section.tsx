"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen } from "lucide-react";
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

const WEATHER_OPTIONS: { value: WeatherType; label: string; icon: string }[] =
  [
    { value: "sunny",  label: "Sunny",  icon: "☀️" },
    { value: "cloudy", label: "Cloudy", icon: "☁️" },
    { value: "rainy",  label: "Rainy",  icon: "🌧️" },
    { value: "windy",  label: "Windy",  icon: "💨" },
    { value: "stormy", label: "Stormy", icon: "⛈️" },
  ];

function weatherIcon(w: WeatherType): string {
  return WEATHER_OPTIONS.find((o) => o.value === w)?.icon ?? "—";
}

function weatherLabel(w: WeatherType): string {
  return WEATHER_OPTIONS.find((o) => o.value === w)?.label ?? w;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

const BLANK = {
  date: todayStr(),
  weather: "sunny" as WeatherType,
  workers: "1",
  notes: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

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

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Site diary</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setError(null);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Plus size={13} strokeWidth={2.5} aria-hidden />
          Add entry
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="space-y-3 border-b border-slate-200 bg-slate-50 px-6 py-4"
        >
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Weather
              </label>
              <select
                value={form.weather}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    weather: e.target.value as WeatherType,
                  }))
                }
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
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Workers on site
              </label>
              <input
                type="number"
                min="0"
                value={form.workers}
                onChange={(e) =>
                  setForm((f) => ({ ...f, workers: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="What happened on site today?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Add entry"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm({ ...BLANK, date: todayStr() });
                setError(null);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Entries list */}
      {entries.length === 0 && !showForm ? (
        <div className="flex flex-col items-center py-10 text-center">
          <BookOpen size={28} className="mb-3 text-slate-300" aria-hidden />
          <p className="text-sm text-slate-500">
            No diary entries yet. Start logging daily site activity.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <li key={entry.id} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-xl leading-none"
                  role="img"
                  aria-label={entry.weather}
                >
                  {weatherIcon(entry.weather)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(entry.date)}
                    </p>
                    <span className="text-xs text-slate-500">
                      {weatherLabel(entry.weather)}
                    </span>
                    <span className="text-xs text-slate-500">
                      · {entry.workers_on_site}{" "}
                      {entry.workers_on_site === 1 ? "worker" : "workers"} on
                      site
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-900">
                    {entry.notes}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
