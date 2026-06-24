"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            company_name: companyName.trim() || null,
          },
        },
      });

      console.log("[Register] signUp response:", { data, error: signUpError });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.session) {
        router.push("/dashboard");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      console.error("[Register] signUp threw:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Check the console.");
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sl-green-50)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sl-green-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
          Check your email
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          We&apos;ve sent a confirmation link to{" "}
          <span className="font-medium text-[var(--foreground)]">{email}</span>.
          Click the link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-[var(--foreground)]">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-[var(--muted-foreground)]">
        Start managing your construction business properly.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Company name{" "}
            <span className="font-normal text-[var(--muted-foreground)]">
              (optional)
            </span>
          </label>
          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Smith Contractors (Pty) Ltd"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@smithcontractors.co.za"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

// Metadata can't be exported from a Client Component — see (auth)/layout.tsx
