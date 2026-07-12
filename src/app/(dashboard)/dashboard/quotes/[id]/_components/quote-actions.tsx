"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle, XCircle, ArrowRight } from "lucide-react";

type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired";

type Props = {
  quoteId: string;
  status: QuoteStatus;
};

const BAR: Record<
  QuoteStatus,
  { bar: string; text: string; message: string }
> = {
  draft:    { bar: "bg-slate-100 border-slate-200",    text: "text-slate-700",   message: "This quote is a draft."                    },
  sent:     { bar: "bg-blue-50 border-blue-200",        text: "text-blue-800",    message: "Quote sent — waiting for client response." },
  viewed:   { bar: "bg-amber-50 border-amber-200",      text: "text-amber-800",   message: "Client has viewed this quote."             },
  accepted: { bar: "bg-emerald-50 border-emerald-200",  text: "text-emerald-800", message: "This quote has been accepted."             },
  declined: { bar: "bg-red-50 border-red-200",          text: "text-red-800",     message: "This quote was declined by the client."    },
  expired:  { bar: "bg-slate-100 border-slate-200",    text: "text-slate-500",   message: "This quote has expired."                   },
};

export default function QuoteActions({ quoteId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<QuoteStatus | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  async function changeStatus(next: QuoteStatus) {
    setLoading(next);
    const supabase = (await import("@/lib/supabase")).createClient();

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
    <div className={`rounded-xl border px-5 py-3.5 ${bar.bar}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm font-medium ${bar.text}`}>{bar.message}</p>

        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button
              onClick={() => changeStatus("sent")}
              disabled={loading !== null}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              <Send size={13} aria-hidden />
              {loading === "sent" ? "Updating…" : "Mark as Sent"}
            </button>
          )}

          {(status === "sent" || status === "viewed") && (
            <>
              <button
                onClick={() => changeStatus("accepted")}
                disabled={loading !== null}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckCircle size={14} aria-hidden />
                {loading === "accepted" ? "Updating…" : "Mark as Accepted"}
              </button>
              <button
                onClick={() => changeStatus("declined")}
                disabled={loading !== null}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                <XCircle size={14} aria-hidden />
                {loading === "declined" ? "Updating…" : "Mark as Declined"}
              </button>
            </>
          )}

          {status === "accepted" && (
            <div className="relative">
              <button
                onClick={handleConvertToProject}
                className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Convert to Project
                <ArrowRight size={13} aria-hidden />
              </button>
              {showComingSoon && (
                <div className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
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
