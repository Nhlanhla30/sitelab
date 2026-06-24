import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { formatZAR, formatDate } from "@/utils";
import ProjectStatus from "./_components/project-status";
import MilestonesSection from "./_components/milestones-section";
import DiarySection from "./_components/diary-section";

export const metadata: Metadata = { title: "Project" };

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type MilestoneRow = Database["public"]["Tables"]["project_milestones"]["Row"];

type DiaryEntry = {
  id: string;
  date: string;
  weather: "sunny" | "cloudy" | "rainy" | "windy" | "stormy";
  workers_on_site: number;
  notes: string;
  created_at: string;
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [projectResult, milestonesResult, diaryResult] = await Promise.all([
    db
      .from("projects")
      .select("*, clients(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as Promise<{
      data: (ProjectRow & { clients: ClientRow | null }) | null;
      error: unknown;
    }>,
    db
      .from("project_milestones")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true }) as Promise<{
      data: MilestoneRow[] | null;
    }>,
    db
      .from("site_diary_entries")
      .select("id, date, weather, workers_on_site, notes, created_at")
      .eq("project_id", id)
      .order("date", { ascending: false }) as Promise<{
      data: DiaryEntry[] | null;
      error: unknown;
    }>,
  ]);

  if (projectResult.error || !projectResult.data) notFound();

  const project = projectResult.data;
  const client = project.clients;
  const milestones = milestonesResult.data ?? [];
  const diaryEntries = diaryResult.data ?? [];

  const overallProgress =
    milestones.length > 0
      ? Math.round(
          milestones.reduce((s, m) => s + m.percent_complete, 0) /
            milestones.length
        )
      : 0;

  return (
    <div className="p-8">
      {/* Back link */}
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Projects
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {project.name}
            </h1>
            {client && (
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {client.name}
                {(project.city || project.province) && (
                  <span> · {[project.city, project.province].filter(Boolean).join(", ")}</span>
                )}
              </p>
            )}
          </div>
          <ProjectStatus projectId={project.id} status={project.status} />
        </div>

        {project.description && (
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            {project.description}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap gap-6">
          {project.budget > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Budget</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">{formatZAR(project.budget)}</p>
            </div>
          )}
          {project.start_date && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Start date</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">{formatDate(project.start_date)}</p>
            </div>
          )}
          {project.end_date && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">End date</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">{formatDate(project.end_date)}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Progress</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--sl-slate-200)]">
                <div
                  className="h-full rounded-full bg-[var(--sl-green-500)] transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {overallProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <MilestonesSection projectId={project.id} milestones={milestones} />
        <DiarySection
          projectId={project.id}
          createdBy={user.id}
          entries={diaryEntries}
        />
      </div>
    </div>
  );
}
