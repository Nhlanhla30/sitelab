import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profileResult = await supabase
    .from("profiles")
    .select("full_name, company_name, plan")
    .eq("id", user.id)
    .single();

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
    { label: "Active Quotes", value: "—", href: "/quotes" },
    { label: "Active Projects", value: "—", href: "/projects" },
    { label: "Total Clients", value: "—", href: "/clients" },
    { label: "Pending Invoices", value: "—", href: "/invoices" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {profile?.company_name
            ? `${profile.company_name} · `
            : ""}
          Here&apos;s what&apos;s happening on your sites today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Getting started card */}
      <div className="mx-auto max-w-lg rounded-xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sl-green-50)]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--sl-green-500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
          Create your first quote
        </h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          Build a professional quote in minutes. Send it via WhatsApp or email,
          track when it&apos;s viewed, and get a digital signature.
        </p>
        <Link
          href="/quotes/new"
          className="inline-block rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          New quote
        </Link>
      </div>
    </div>
  );
}
