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
  { value: "planning",    label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold",     label: "On Hold" },
  { value: "completed",   label: "Completed" },
  { value: "cancelled",   label: "Cancelled" },
];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planning:    "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  on_hold:     "bg-[var(--sl-slate-100)] text-[var(--sl-slate-600)]",
  completed:   "bg-[var(--sl-green-50)] text-[var(--sl-green-700)]",
  cancelled:   "bg-red-50 text-red-700",
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
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
        {OPTIONS.find((o) => o.value === status)?.label ?? status}
      </span>
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {loading && (
        <span className="text-xs text-[var(--muted-foreground)]">Saving…</span>
      )}
    </div>
  );
}
