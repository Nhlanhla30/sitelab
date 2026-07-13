import Link from "next/link";
import Image from "next/image";
import { Camera, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="bg-white text-slate-900">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-mono text-sm font-bold uppercase tracking-widest text-slate-900">
            SiteLab
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-slate-500 transition-colors hover:text-slate-900">Features</Link>
            <Link href="/pricing"  className="text-sm text-slate-500 transition-colors hover:text-slate-900">Pricing</Link>
            <Link href="/about"    className="text-sm text-slate-500 transition-colors hover:text-slate-900">About</Link>
            <Link href="/contact"  className="text-sm text-slate-500 transition-colors hover:text-slate-900">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"    className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</Link>
            <Link href="/register" className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen overflow-hidden pt-16">
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Crosshair marks at a handful of grid intersections */}
        <span aria-hidden className="absolute left-[160px] top-[160px] select-none font-mono text-xs text-slate-300">+</span>
        <span aria-hidden className="absolute left-[560px] top-[160px] select-none font-mono text-xs text-slate-300">+</span>
        <span aria-hidden className="absolute left-[320px] top-[400px] select-none font-mono text-xs text-slate-300">+</span>
        <span aria-hidden className="absolute right-[200px] top-[560px] select-none font-mono text-xs text-slate-300">+</span>
        <span aria-hidden className="absolute left-[80px]  top-[480px] select-none font-mono text-xs text-slate-300">+</span>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

            {/* Left — 7 columns */}
            <div className="lg:col-span-7">
              <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-7xl">
                Your construction<br />
                business deserves<br />
                <span className="inline-block border-b-8 border-emerald-500 pb-1 leading-none">
                  better
                </span>{" "}than<br />
                scattered chats.
              </h1>
              <p className="mb-10 max-w-prose text-lg leading-relaxed text-slate-600">
                Quotes, projects, clients, and site diaries — all in one place.
                SiteLab replaces the spreadsheets, scattered messages, and paper
                trails that cost you time and jobs.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Get started free
                  <ArrowRight size={15} aria-hidden />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 rounded border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  See the platform
                </Link>
              </div>
              <p className="mt-4 font-mono text-xs text-slate-400">
                Free plan available · No credit card required
              </p>
            </div>

            {/* Right — 5 columns: site diary card */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <div className="w-full max-w-sm rotate-1 rounded-sm border border-slate-200 bg-white shadow-[8px_8px_0_#0f172a]">
                {/* Card header */}
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Site Diary</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">Ndlovu Residence — Sandton</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500">Entry #23 · 12 Jul 2026</p>
                </div>
                {/* Meta strip */}
                <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200">
                  <div className="px-3 py-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Weather</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">Partly cloudy</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">On site</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">6 workers</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Phase</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">Roofing</p>
                  </div>
                </div>
                {/* Notes */}
                <div className="border-b border-slate-200 px-4 py-3">
                  <p className="text-xs leading-relaxed text-slate-600">
                    Steel trusses installed — 80% complete. Awaiting delivery of
                    ridge capping. Minor delay: supplier ETA revised to Friday.
                  </p>
                </div>
                {/* Photo grid — real images with slate placeholder behind each as fallback */}
                <div className="grid grid-cols-3 gap-1.5 border-b border-slate-200 p-3">
                  {([
                    { src: "/images/diary-1.jpg", alt: "Site photo 1" },
                    { src: "/images/diary-2.jpg", alt: "Site photo 2" },
                    { src: "/images/diary-3.jpg", alt: "Site photo 3" },
                  ] as const).map((photo) => (
                    <div
                      key={photo.src}
                      className="relative aspect-square overflow-hidden rounded-sm border border-slate-200 bg-slate-100"
                    >
                      {/* Camera icon sits behind the image; shows if image fails to load */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera size={12} className="text-slate-300" aria-hidden />
                      </div>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                        sizes="150px"
                        quality={90}
                      />
                    </div>
                  ))}
                </div>
                {/* Status footer */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Status</span>
                  <span className="rounded-sm bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600">
                    ON TRACK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIMENSION LINE — tape measure ─── */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center">
            <div className="h-3 w-px bg-slate-300" />
            <div className="h-px flex-1 bg-slate-300" />
          </div>
          <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-slate-400">
            ← from quote to handover →
          </span>
          <div className="flex flex-1 items-center">
            <div className="h-px flex-1 bg-slate-300" />
            <div className="h-3 w-px bg-slate-300" />
          </div>
        </div>
      </div>

      {/* ─── PAIN POINTS — snag list ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section annotation */}
          <div className="mb-16 flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Site inspection report · Defects list
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Sound familiar?
          </h2>
          <p className="mb-16 max-w-prose text-slate-600">
            If you&apos;re a South African contractor, you&apos;re probably
            losing money to these problems right now.
          </p>

          {/* Numbered snag rows */}
          {[
            {
              n: "01",
              pain: "Quotes sent and never followed up",
              desc: "You send a quote, forget to follow up, and lose the job to someone who did.",
            },
            {
              n: "02",
              pain: '"How far are you?" calls every day',
              desc: "Clients can't see progress. They call. You stop working to answer. Repeat.",
            },
            {
              n: "03",
              pain: "Site photos scattered across chats and drives",
              desc: "Photos from 3 weeks ago? Good luck finding them buried across group chats, email threads, and SD cards.",
            },
            {
              n: "04",
              pain: "Excel invoices with wrong VAT",
              desc: "Copy-pasting formulas in Excel at 10pm. One wrong cell and your invoice is off by thousands.",
            },
            {
              n: "05",
              pain: "No idea if you're making money",
              desc: "You finished the job. But between materials, labour, and scope changes — did you actually profit?",
            },
            {
              n: "06",
              pain: "Workers don't know what to do",
              desc: "You explained the task. They didn't read it. Now it's done wrong and you're paying twice.",
            },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-6 border-t border-slate-200 py-8 md:gap-12">
              <span
                aria-hidden
                className="w-16 flex-shrink-0 select-none font-mono text-5xl font-bold leading-none text-slate-200 md:w-24 md:text-7xl"
              >
                {item.n}
              </span>
              <div className="pt-1">
                <h3 className="mb-2 text-lg font-bold text-slate-900 md:text-xl">{item.pain}</h3>
                <p className="max-w-prose text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-slate-200" />
        </div>
      </section>

      {/* ─── FEATURES — available now ─── */}
      <section id="features" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section annotation */}
          <div className="mb-16 flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
              What&apos;s built · Available now
            </p>
            <div className="h-px flex-1 bg-slate-300" />
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            One platform. Everything organised.
          </h2>
          <p className="mb-20 max-w-prose text-slate-600">
            SiteLab gives you the tools to run a professional construction
            business — without the enterprise price tag.
          </p>

          {/* 01 — Quote Builder: text left, vignette right */}
          <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-600">
                01 · Quote Builder
              </p>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">
                Professional quotes in minutes, not hours.
              </h3>
              <p className="max-w-prose leading-relaxed text-slate-600">
                Create itemised quotes with labour, material, and equipment line
                items. Send via WhatsApp or email. Track views and get digital
                sign-off. VAT calculated automatically.
              </p>
            </div>
            {/* Mini quote table */}
            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-xs font-bold text-slate-900">QUO-0042 · Smith Residence</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">Valid until: 11 Aug 2026 · Draft</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Description</th>
                    <th className="px-4 py-2 text-right font-mono text-[10px] uppercase tracking-widest text-slate-400">Qty</th>
                    <th className="px-4 py-2 text-right font-mono text-[10px] uppercase tracking-widest text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-2.5 text-xs text-slate-700">Foundation concrete (m³)</td>
                    <td className="px-4 py-2.5 text-right text-xs text-slate-500">12</td>
                    <td className="px-4 py-2.5 text-right text-xs font-medium text-slate-900">R 14 400</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs text-slate-700">Brickwork (m²)</td>
                    <td className="px-4 py-2.5 text-right text-xs text-slate-500">84</td>
                    <td className="px-4 py-2.5 text-right text-xs font-medium text-slate-900">R 25 200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs text-slate-700">Labour (days)</td>
                    <td className="px-4 py-2.5 text-right text-xs text-slate-500">18</td>
                    <td className="px-4 py-2.5 text-right text-xs font-medium text-slate-900">R 18 000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="px-4 py-2.5 text-xs font-bold text-slate-900" colSpan={2}>Total incl. VAT</td>
                    <td className="px-4 py-2.5 text-right text-xs font-bold text-emerald-600">R 66 240</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 02 — Project Tracker: vignette left, text right */}
          <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Milestone list vignette */}
            <div className="order-2 rounded-sm border border-slate-200 bg-white p-4 shadow-sm lg:order-1">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Milestones · Ndlovu Residence
              </p>
              {[
                { label: "Foundation & slab",    date: "14 May 2026", state: "done"    },
                { label: "Brickwork & lintel",   date: "02 Jun 2026", state: "done"    },
                { label: "Roof structure",        date: "18 Jul 2026", state: "active"  },
                { label: "Plumbing rough-in",    date: "05 Aug 2026", state: "pending" },
                { label: "Electrical first fix",  date: "20 Aug 2026", state: "pending" },
                { label: "Finishes & handover",  date: "30 Sep 2026", state: "pending" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0">
                  <div
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${
                      m.state === "done"
                        ? "bg-emerald-500"
                        : m.state === "active"
                        ? "bg-amber-400"
                        : "bg-slate-200"
                    }`}
                  />
                  <p className={`flex-1 text-xs font-medium ${m.state === "pending" ? "text-slate-400" : "text-slate-800"}`}>
                    {m.label}
                  </p>
                  <span
                    className={`flex-shrink-0 font-mono text-[9px] uppercase tracking-widest ${
                      m.state === "done"
                        ? "text-emerald-600"
                        : m.state === "active"
                        ? "text-amber-600"
                        : "text-slate-300"
                    }`}
                  >
                    {m.state === "done" ? "DONE" : m.state === "active" ? "IN PROG" : m.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-600">
                02 · Project Tracker
              </p>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">
                Daily diaries. Milestone tracking. Total site visibility.
              </h3>
              <p className="max-w-prose leading-relaxed text-slate-600">
                Log site activity every day — weather, workers, photos, and
                notes. Track milestones and manage change orders with client
                approval built in. Works offline on site.
              </p>
            </div>
          </div>

          {/* 03 — Client Portal: text left, vignette right */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-600">
                03 · Client Portal
              </p>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">
                Your clients see progress. Stop taking the calls.
              </h3>
              <p className="max-w-prose leading-relaxed text-slate-600">
                Clients log in to a live project view — photos, milestones,
                invoices, change approvals. No more &ldquo;how far are
                you?&rdquo; calls. No more printing progress reports.
              </p>
            </div>
            {/* Client portal vignette */}
            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">Khumalo Villa</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">Client: T. Khumalo · Midrand</p>
                </div>
                <span className="rounded-sm bg-emerald-50 px-2 py-1 font-mono text-[9px] font-semibold text-emerald-600">
                  LIVE
                </span>
              </div>
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="mb-1.5 flex justify-between font-mono text-[10px] text-slate-500">
                  <span>Overall progress</span>
                  <span>67%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "67%" }} />
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                  Recent updates
                </p>
                {[
                  { date: "12 Jul", text: "Roof trusses 80% installed" },
                  { date: "08 Jul", text: "Brickwork completed & signed off" },
                  { date: "01 Jul", text: "Change order #3 approved" },
                ].map((u) => (
                  <div key={u.date} className="flex gap-3 border-b border-slate-100 py-1.5 last:border-0">
                    <span className="w-10 flex-shrink-0 font-mono text-[10px] text-slate-400">{u.date}</span>
                    <span className="text-xs text-slate-700">{u.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMING SOON — slim strip ─── */}
      <section className="border-t border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Coming soon</p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-200 rounded-sm border border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                title: "Invoicing & Payments",
                desc: "Generate invoices from accepted quotes. SARS VAT compliant. Instant payment reminders.",
              },
              {
                title: "Team Management",
                desc: "Assign tasks, track hours, manage subcontractors. Everyone knows what to do.",
              },
              {
                title: "WhatsApp Integration",
                desc: "Send quotes, updates, and reminders via WhatsApp — where your clients already are.",
              },
            ].map((f) => (
              <div key={f.title} className="px-6 py-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-700">{f.title}</h4>
                  <span className="flex-shrink-0 rounded-sm bg-slate-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                    Soon
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section>
        {/* Safety-stripe top border */}
        <div
          aria-hidden
          className="h-1 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #059669 0, #059669 4px, #0f172a 4px, #0f172a 10px)",
          }}
        />
        <div className="bg-slate-900 px-6 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-500">
              SiteLab · Get started
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to run your business properly?
            </h2>
            <p className="mx-auto mb-10 max-w-prose leading-relaxed text-slate-400">
              Join South African contractors who are done working from
              spreadsheets and paper. Start for free, upgrade when you grow.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded bg-emerald-600 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Start free — no card required
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-slate-900">
            SiteLab
          </span>
          <div className="flex gap-6">
            <Link href="/about"   className="text-sm text-slate-500 hover:text-slate-900">About</Link>
            <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900">Pricing</Link>
            <Link href="/contact" className="text-sm text-slate-500 hover:text-slate-900">Contact</Link>
          </div>
          <p className="font-mono text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {siteConfig.creator}. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
