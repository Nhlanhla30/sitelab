import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
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
  { label: string; badge: string }
> = {
  planning:    { label: "Planning",    badge: "bg-blue-100 text-blue-700"      },
  in_progress: { label: "In Progress", badge: "bg-amber-100 text-amber-700"    },
  on_hold:     { label: "On Hold",     badge: "bg-slate-100 text-slate-600"    },
  completed:   { label: "Completed",   badge: "bg-emerald-100 text-emerald-700" },
  cancelled:   { label: "Cancelled",   badge: "bg-red-100 text-red-700"        },
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
    <>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {projects.length === 0
              ? "No projects yet"
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
          </p>
        </div>
        <NewProjectModal userId={user.id} clients={clients} />
      </div>

      {projects.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FolderOpen size={24} className="text-slate-400" aria-hidden />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">
            No projects yet
          </h3>
          <p className="mb-5 text-sm text-slate-500">
            Create your first project to track milestones and site diary
            entries.
          </p>
          <NewProjectModal userId={user.id} clients={clients} />
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Start
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    End
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => {
                  const s = STATUS_CONFIG[project.status];
                  const pct = progress(project.project_milestones ?? []);
                  const clientName = project.clients?.name ?? "—";
                  return (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="font-semibold text-emerald-600 hover:underline"
                        >
                          {project.name}
                        </Link>
                        {(project.city || project.province) && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {[project.city, project.province]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {clientName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {project.start_date
                          ? formatDate(project.start_date)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {project.end_date ? formatDate(project.end_date) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {project.budget > 0 ? formatZAR(project.budget) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="min-w-[2rem] text-xs font-medium text-slate-500">
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
        </div>
      )}
    </>
  );
}
