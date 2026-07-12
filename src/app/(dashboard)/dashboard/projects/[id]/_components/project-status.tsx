"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

const OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning",    label: "Planning"    },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold",     label: "On Hold"     },
  { value: "completed",   label: "Completed"   },
  { value: "cancelled",   label: "Cancelled"   },
];

const STATUS_BADGE: Record<ProjectStatus, string> = {
  planning:    "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  on_hold:     "bg-slate-100 text-slate-600",
  completed:   "bg-emerald-100 text-emerald-700",
  cancelled:   "bg-red-100 text-red-700",
};

type Props = { projectId: string; status: ProjectStatus };

export default function ProjectStatus({ projectId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProjectStatus;
    setLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("projects") as any)
      .update({ status: next })
      .eq("id", projectId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status]}`}
      >
        {OPTIONS.find((o) => o.value === status)?.label ?? status}
      </span>
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {loading && (
        <span className="text-xs text-slate-500">Saving…</span>
      )}
    </div>
  );
}
