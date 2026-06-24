"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type QuoteStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";

type Props = {
  quoteId: string;
  status: QuoteStatus;
};

const BAR: Record<QuoteStatus, { bg: string; border: string; text: string; message: string }> = {
  draft:    { bg: "bg-[var(--sl-slate-100)]",   border: "border-[var(--sl-slate-200)]", text: "text-[var(--sl-slate-700)]", message: "This quote is a draft." },
  sent:     { bg: "bg-blue-50",                  border: "border-blue-200",              text: "text-blue-800",              message: "Quote sent — waiting for client response." },
  viewed:   { bg: "bg-amber-50",                 border: "border-amber-200",             text: "text-amber-800",             message: "Client has viewed this quote." },
  accepted: { bg: "bg-[var(--sl-green-50)]",     border: "border-[var(--sl-green-100)]", text: "text-[var(--sl-green-700)]", message: "This quote has been accepted." },
  declined: { bg: "bg-red-50",                   border: "border-red-200",               text: "text-red-800",               message: "This quote was declined by the client." },
  expired:  { bg: "bg-[var(--sl-slate-100)]",   border: "border-[var(--sl-slate-200)]", text: "text-[var(--sl-slate-500)]", message: "This quote has expired." },
};

export default function QuoteActions({ quoteId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<QuoteStatus | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  async function changeStatus(next: QuoteStatus) {
    setLoading(next);
    const supabase = createClient();

    const timestamps: Record<string, string> = {};
    if (next === "sent") timestamps.sent_at = new Date().toISOString();
    if (next === "accepted" || next === "declined")
      timestamps.responded_at = new Date().toISOString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("quotes") as any)
      .update({ status: next, ...timestamps })
      .eq("id", quoteId);

    router.refresh();
    setLoading(null);
  }

  function handleConvertToProject() {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  }

  const bar = BAR[status];

  return (
    <div className={`rounded-xl border px-5 py-3.5 ${bar.bg} ${bar.border}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm font-medium ${bar.text}`}>{bar.message}</p>

        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button
              onClick={() => changeStatus("sent")}
              disabled={loading !== null}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading === "sent" ? "Updating…" : "Mark as Sent"}
            </button>
          )}

          {(status === "sent" || status === "viewed") && (
            <>
              <button
                onClick={() => changeStatus("accepted")}
                disabled={loading !== null}
                className="rounded-lg bg-[var(--sl-green-500)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading === "accepted" ? "Updating…" : "Mark as Accepted"}
              </button>
              <button
                onClick={() => changeStatus("declined")}
                disabled={loading !== null}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading === "declined" ? "Updating…" : "Mark as Declined"}
              </button>
            </>
          )}

          {status === "accepted" && (
            <div className="relative">
              <button
                onClick={handleConvertToProject}
                className="rounded-lg border border-[var(--sl-green-300)] bg-white px-4 py-2 text-sm font-semibold text-[var(--sl-green-700)] transition-colors hover:bg-[var(--sl-green-50)]"
              >
                Convert to Project
              </button>
              {showComingSoon && (
                <div className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-lg bg-[var(--sl-slate-900)] px-3 py-2 text-xs text-white shadow-lg">
                  Coming soon — project management in v2
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
