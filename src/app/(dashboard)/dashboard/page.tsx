import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, FolderOpen, Users, Receipt, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Dashboard" };

const STAT_META = {
  quotes:   { bg: "bg-blue-50",    icon: "text-blue-500"    },
  projects: { bg: "bg-amber-50",   icon: "text-amber-500"   },
  clients:  { bg: "bg-emerald-50", icon: "text-emerald-600" },
  invoices: { bg: "bg-purple-50",  icon: "text-purple-500"  },
} as const;

const ICONS = {
  quotes:   FileText,
  projects: FolderOpen,
  clients:  Users,
  invoices: Receipt,
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, quotesResult, projectsResult, clientsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, company_name, plan")
        .eq("id", user.id)
        .single(),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["draft", "sent", "viewed"]),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["planning", "in_progress"]),
      supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const profile = profileResult.data as {
    full_name: string;
    company_name: string | null;
    plan: string;
  } | null;

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  const stats = [
    {
      key: "quotes" as const,
      label: "Active Quotes",
      value: quotesResult.count ?? 0,
      href: "/dashboard/quotes",
    },
    {
      key: "projects" as const,
      label: "Active Projects",
      value: projectsResult.count ?? 0,
      href: "/dashboard/projects",
    },
    {
      key: "clients" as const,
      label: "Total Clients",
      value: clientsResult.count ?? 0,
      href: "/dashboard/clients",
    },
    {
      key: "invoices" as const,
      label: "Pending Invoices",
      value: "—",
      href: "/dashboard/invoices",
    },
  ];

  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {profile?.company_name ? `${profile.company_name} · ` : ""}
            Here&apos;s what&apos;s happening on your sites today.
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <FileText size={14} aria-hidden />
          New quote
        </Link>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-4 gap-6">
        {stats.map(({ key, label, value, href }) => {
          const { bg, icon } = STAT_META[key];
          const Icon = ICONS[key];
          return (
            <Link
              key={key}
              href={href}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon size={17} className={icon} aria-hidden />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            </Link>
          );
        })}
      </div>

      {/* Getting started */}
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <FileText size={22} className="text-emerald-600" aria-hidden />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Create your first quote
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          Build a professional quote in minutes. Send it via WhatsApp or email,
          track when it&apos;s viewed, and get a digital signature.
        </p>
        <Link
          href="/dashboard/quotes/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          New quote
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </>
  );
}
