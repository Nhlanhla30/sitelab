import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main>
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-[var(--primary)]">
            SiteLab
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
            Built for South African contractors
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
            Stop running your{" "}
            <span className="text-[var(--primary)]">construction business</span>{" "}
            from WhatsApp
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl">
            Quotes, projects, clients, and invoices — all in one place. SiteLab
            replaces the Excel spreadsheets, scattered WhatsApp messages, and
            manual processes that cost you time and money.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl sm:w-auto"
            >
              Get started free
            </Link>
            <Link
              href="#features"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] sm:w-auto"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[var(--foreground)]">
            Sound familiar?
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-[var(--muted-foreground)]">
            If you&apos;re a South African contractor, you&apos;re probably
            losing money to these problems right now.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                pain: "Quotes disappear into WhatsApp",
                desc: "You send a quote, forget to follow up, and lose the job to someone who did.",
              },
              {
                pain: "\"How far are you?\" calls every day",
                desc: "Clients can't see progress. They call. You stop working to answer. Repeat.",
              },
              {
                pain: "Photos lost in chat scroll",
                desc: "Site photos from 3 weeks ago? Good luck finding them in a WhatsApp group with 847 messages.",
              },
              {
                pain: "Excel invoices with wrong VAT",
                desc: "Copy-pasting formulas in Excel at 10pm. One wrong cell and your invoice is off by thousands.",
              },
              {
                pain: "No idea if you're making money",
                desc: "You finished the job. But between materials, labour, and scope changes — did you actually profit?",
              },
              {
                pain: "Workers don't know what to do",
                desc: "You explained the task on WhatsApp. They didn't read it. Now it's done wrong and you're paying twice.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
              >
                <div className="mb-2 text-2xl">😤</div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                  {item.pain}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[var(--foreground)]">
            One platform. Everything organised.
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-[var(--muted-foreground)]">
            SiteLab gives you the tools to run a professional construction
            business — without the enterprise price tag.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Quote Builder",
                desc: "Create branded quotes in minutes. Send via WhatsApp or email. Track if they've been viewed. Get digital signatures.",
                tag: "Available now",
              },
              {
                title: "Project Tracker",
                desc: "Daily site diaries with photos and weather logs. Milestone tracking. Change order approvals. Works offline.",
                tag: "Available now",
              },
              {
                title: "Client Portal",
                desc: "Your clients log in to see progress, approve changes, and view invoices. No more \"how far are you?\" calls.",
                tag: "Available now",
              },
              {
                title: "Invoicing & Payments",
                desc: "Generate invoices from accepted quotes. Track payments. Send reminders via WhatsApp. SARS VAT compliant.",
                tag: "Coming soon",
              },
              {
                title: "Team Management",
                desc: "Assign tasks, track worker hours, manage subcontractors. Everyone knows what to do and when.",
                tag: "Coming soon",
              },
              {
                title: "WhatsApp Integration",
                desc: "Send quotes, reminders, and updates via WhatsApp — where your clients and team already are.",
                tag: "Coming soon",
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      feature.tag === "Available now"
                        ? "bg-[var(--sl-green-50)] text-[var(--sl-green-700)]"
                        : "bg-[var(--sl-slate-100)] text-[var(--sl-slate-600)]"
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-[var(--border)] bg-[var(--sl-slate-900)] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to run your business properly?
          </h2>
          <p className="mb-8 text-lg text-[var(--sl-slate-400)]">
            Join South African contractors who are done losing quotes in
            WhatsApp. Start for free, upgrade when you grow.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start free — no card required
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="text-lg font-bold text-[var(--primary)]">
              SiteLab
            </span>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Construction management for South African builders.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="/about" className="hover:text-[var(--foreground)]">
              About
            </Link>
            <Link href="/pricing" className="hover:text-[var(--foreground)]">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-[var(--foreground)]">
              Contact
            </Link>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} {siteConfig.creator}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
