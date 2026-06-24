import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import { formatZAR, formatDate } from "@/utils";
import NewProjectModal from "./_components/new-project-modal";

export const metadata: Metadata = { title: "Projects" };

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectWithRelations = ProjectRow & {
  clients: { name: string } | null;
  project_milestones: { percent_complete: number }[];
};

const STATUS_CONFIG: Record<
  ProjectRow["status"],
  { label: string; bg: string; text: string }
> = {
  planning:    { label: "Planning",    bg: "bg-blue-100",                    text: "text-blue-700" },
  in_progress: { label: "In Progress", bg: "bg-amber-100",                   text: "text-amber-700" },
  on_hold:     { label: "On Hold",     bg: "bg-[var(--sl-slate-100)]",       text: "text-[var(--sl-slate-600)]" },
  completed:   { label: "Completed",   bg: "bg-[var(--sl-green-50)]",        text: "text-[var(--sl-green-700)]" },
  cancelled:   { label: "Cancelled",   bg: "bg-red-50",                      text: "text-red-700" },
};

function progress(milestones: { percent_complete: number }[]): number {
  if (milestones.length === 0) return 0;
  return Math.round(
    milestones.reduce((s, m) => s + m.percent_complete, 0) / milestones.length
  );
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [projectsResult, clientsResult] = await Promise.all([
    db
      .from("projects")
      .select("*, clients(name), project_milestones(percent_complete)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as Promise<{
      data: ProjectWithRelations[] | null;
    }>,
    db
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }) as Promise<{
      data: { id: string; name: string }[] | null;
    }>,
  ]);

  const projects = projectsResult.data ?? [];
  const clients = clientsResult.data ?? [];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <NewProjectModal userId={user.id} clients={clients} />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-16 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No projects yet. Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sl-slate-50)]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Start</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">End</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.map((project) => {
                const s = STATUS_CONFIG[project.status];
                const pct = progress(project.project_milestones ?? []);
                const clientName = project.clients?.name ?? "—";
                return (
                  <tr key={project.id} className="transition-colors hover:bg-[var(--sl-slate-50)]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium text-[var(--primary)] hover:underline"
                      >
                        {project.name}
                      </Link>
                      {(project.city || project.province) && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {[project.city, project.province].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{clientName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      {project.start_date ? formatDate(project.start_date) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      {project.end_date ? formatDate(project.end_date) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">
                      {project.budget > 0 ? formatZAR(project.budget) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--sl-slate-200)]">
                          <div
                            className="h-full rounded-full bg-[var(--sl-green-500)] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="min-w-[2.5rem] text-xs text-[var(--muted-foreground)]">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
