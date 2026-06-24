import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "SiteLab",
    template: "%s | SiteLab",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--sl-slate-50)] px-4 py-12">
      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--sl-slate-900) 1px, transparent 1px), linear-gradient(90deg, var(--sl-slate-900) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[var(--primary)]">
              SiteLab
            </span>
          </Link>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Construction management for South African builders
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} SiteLab (Pty) Ltd. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
