"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",          label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/quotes",   label: "Quotes",    Icon: FileText },
  { href: "/dashboard/projects", label: "Projects",  Icon: FolderOpen },
  { href: "/dashboard/clients",  label: "Clients",   Icon: Users },
  { href: "/dashboard/invoices", label: "Invoices",  Icon: Receipt },
  { href: "/dashboard/settings", label: "Settings",  Icon: Settings },
];

type Props = {
  fullName: string;
  companyName: string;
};

export default function Sidebar({ fullName, companyName }: Props) {
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 flex flex-col z-40">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sl-green-500)]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            SiteLab
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--sl-green-500)] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.5 : 1.75}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sl-green-600)] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {fullName}
            </p>
            {companyName && (
              <p className="truncate text-xs text-slate-400">
                {companyName}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
        >
          <LogOut size={15} aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}
